import {Client, Intents} from 'discord.js'
import WebSocket, { WebSocketServer } from 'ws'
import express from 'express'

const DiscordClient = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES]})
const ExpressApp = express()

const WebServer = ExpressApp.listen(process.env.PORT || 3000)
const WebSocketServ = new WebSocketServer({WebServer})

WebSocketServ.on('connection', ws => {

    ws.on('message', message => {
        message = JSON.parse(message)
        if (message.Message === "Connection") {
            console.log(JSON.stringify(message))
        }
    })

    ws.on('close', () => {

    })
})
