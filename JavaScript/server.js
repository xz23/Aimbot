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

DiscordClient.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return
    if (interaction.commandName === "radiuspercentat1") {
        const value = interaction.options.getNumber("percent")
        sendResponse(interaction.member.user.id, `Proxy.RadiusPercentAt1 = ${value}`)
        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .add
            ]
        })
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
                DiscordClient.channels.cache.get('966154043200266283').send(new MessageEmbed()
                    .setTitle("Script Error")
                    .setDescription(`<@${ConObject.DiscordID}> ${message.Error}`)
                    .setColor("RED")
                    .setTimestamp()
                )   
            }
        }
    })

    ws.on('close', () => {
        const ConObject = CurrentConnections.find(CurrentConnectionObject => CurrentConnectionObject.Connection === ws)
        if (ConObject) {

        }
    })
})


