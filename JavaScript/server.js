import dotenv from 'dotenv'
import path, { dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
dotenv.config({path: path.resolve(dirname(fileURLToPath(import.meta.url)) + '/.env')})

import {Client, GuildInviteManager, Intents, MessageEmbed} from 'discord.js'
import WebSocket, { WebSocketServer } from 'ws'
import express from 'express'

const DiscordClient = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES]})
let MainServer = null
const CurrentConnections = [] /*
{Connection: <ws> object, DiscordID: <Discord ID> number, Player: <Player object> 
    {UserId: <Player UserId> number, Name: <Player Name> string}
}
*/

function sendResponse(DiscordID, response) {
    const ConObject = CurrentConnections.find(CurrentConnectionObject => CurrentConnectionObject.DiscordID === DiscordID)
    if (ConObject) {
        ConObject.Connection.send(response)
    }
}

function changeSetting(DiscordID, commandName, ...values) {
    const Cmds = {
        radiuspercentat1: "RadiusPercentAt1",
        distancebias: "DistanceBias",
        offset: {name: "Offset", ArgCount: 2, Type: "Vector2"},
        silentradiuspercentat1: "SilentRadiusPercentAt1",
        ignoretransparent: "IgnoreTransparent",
        ignorewater: "IgnoreWater",
        transparencythreshold: "TransparencyThreshold",
        isalivecheck: "IsAliveCheck",
        xsmoothingpercent: "XSmoothingPercent",
        ysmoothingpercent: "YSmoothingPercent",
        teamcheck: "TeamCheck",
        targetpart: "TargetPart",
        triggerbot: "TriggerBot",
        invisiblecheck: "InvisibleCheck"
    }
    const RealSetting = Cmds[commandName]
    if (RealSetting) {
        if (typeof(RealSetting) === "string") {
            sendResponse(DiscordID, `Proxy.${RealSetting} = ${values[0]}`)
            return [RealSetting.name, values[0]]
        } else if (typeof(RealSetting) === "object") {
            if (RealSetting.Type === "Vector2") {
                if (values.length == RealSetting.ArgCount) {
                    sendResponse(DiscordID, `Proxy.${RealSetting.name} = Vector2.new(${values[0]}, ${values[1]})`)
                    return [RealSetting.name, `Vector2.new(${values[0]}, ${values[1]})`]
                }
            }
        }
    }
}

function noCon(int) {
    interaction.reply({
        embeds: [
            new MessageEmbed()
                .setTitle("Connection")
                .setDescription(`<@${interaction.member.user.id}> Could not find a established connection`)
                .setColor("RED")
                .setTimestamp()
        ]
    })
}

DiscordClient.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return
    if (interaction.commandName === "radiuspercentat1") {
        const ConObject = CurrentConnections.find(CurrentConnectionObject => CurrentConnectionObject.DiscordID === interaction.member.user.id)
        if (ConObject) {
            const value = interaction.options.getNumber("percent")
            const [settingName, newValue] = changeSetting(interaction.member.user.id, interaction.commandName, value)
            await interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Settings")
                        .setDescription(`<@${interaction.member.user.id}> Setting: ` + "`" + settingName + "` updated to " + newValue)
                        .setColor("GREEN")
                        .setTimestamp()
                    ]       
            })
        } else {
            await noCon(interaction)
        }
    }
})

DiscordClient.on('ready', async () => {
    MainServer = await DiscordClient.guilds.fetch("966154043200266280")
})

DiscordClient.login(process.env.TOKEN)

// Socket stuff

const ExpressApp = express()
const WebServer = ExpressApp.listen(process.env.PORT || 3000)
const WebSocketServ = new WebSocketServer({
    port: 5000
})

WebSocketServ.on('connection', ws => {
    ws.on('message', message => {
        message = JSON.parse(message)
        if (message.Message === "Connection") {
            CurrentConnections.push({
                Connection: ws,
                DiscordID: message.DiscordID,
                Player: message.Player
            })
            DiscordClient.channels.cache.get('966154043200266283').send({embeds: [new MessageEmbed()
                .setTitle("Connected")
                .setDescription(`<@${message.DiscordID}> You are now connected on account: **${message.Player.Name} (${message.Player.UserId})**`)
                .setColor("GREEN")
                .setTimestamp()
            ]}) 
        } else if (message.Message === "Error") {
            const ConObject = CurrentConnections.find(CurrentConnectionObject => CurrentConnectionObject.Connection === ws)
            if (ConObject) {
                DiscordClient.channels.cache.get('966154043200266283').send({embeds: [
                    new MessageEmbed()
                        .setTitle("Script Error")
                        .setDescription(`<@${ConObject.DiscordID}> ${message.Error}`)
                        .setColor("RED")
                        .setTimestamp()
                ]})
            }
        }
    })

    ws.on('close', () => {
        const ConObject = CurrentConnections.find(CurrentConnectionObject => CurrentConnectionObject.Connection === ws)
        if (ConObject) {
            console.log('yes')
            console.log(ConObject.DiscordID, ConObject.Player.Name, ConObject.Player.UserId)
            DiscordClient.channels.cache.get('966154043200266283').send({embeds: [new MessageEmbed()
                .setTitle("Disconnected")
                .setDescription(`<@${ConObject.DiscordID}> You are now disconnected on account: **${ConObject.Player.Name} (${ConObject.Player.UserId})**`)
                .setColor("RED")
                .setTimestamp()
            ]})  
            
            CurrentConnections.splice(
                CurrentConnections.indexOf(
                    ConObject
                ),
                1
            )
        }
    })
})


