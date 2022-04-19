import {Client, Intents} from 'discord.js'
import WebSocket, { WebSocketServer } from 'ws'
import express from 'express'

const DiscordClient = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES]})
const ExpressApp = express()

const WebServer = ExpressApp.listen(process.env.PORT || 3000)
const WebSocketServ = new WebSocketServer({
    port: 5000
})

const CurrentConnections = [] /*
{Connection: <ws> object, DiscordID: <Discord ID> number, Player: <Player object> 
    {UserId: <Player UserId> number, Name: <Player Name> string}
}
*/

WebSocketServ.on('connection', ws => {
    ws.on('message', message => {
        message = JSON.parse(message)
        if (message.Message === "Connection") {
            CurrentConnections.push({
                Connection: ws,
                DiscordID: message.DiscordID,
                Player: message.Player
            })

        }
    })

    ws.on('close', () => {
        const ConObject = CurrentConnections.find(CurrentConnectionObject => CurrentConnectionObject.Connection === ws)
        if (ConObject) {
            
        }
    })
})
