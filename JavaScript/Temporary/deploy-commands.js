import dotenv from 'dotenv'
import path, { dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
dotenv.config({path: path.resolve(dirname(fileURLToPath(import.meta.url)) + '/../.env')})
//
import { Routes } from 'discord-api-types/v9'
import { REST } from '@discordjs/rest'
import { SlashCommandBuilder } from '@discordjs/builders';
import { Client } from 'discord.js'

const token = process.env.TOKEN
console.log(token)
const commands = [
        new SlashCommandBuilder().setName('radiuspercentat1').setDescription('Radius percent of screen witdth at 1 stud for aimbot').addNumberOption(option => {
            option.setName('percent')
                .setDescription('sup')
                .setRequired(true)
                return option
        }),

        new SlashCommandBuilder().setName('distancebias').setDescription('Raises sensitivity of distance from camera when choosing target').addNumberOption(option => {
            option.setName('raiser')
                .setDescription('sup')
                .setRequired(true)
                return option
        }),

        new SlashCommandBuilder().setName('offset').setDescription('Mouse offset in pixels').addNumberOption(option => {
            option.setName('x')
                .setDescription('sup')
                .setRequired(true)
                return option
        }).addNumberOption(option => {
            option.setName('y')
                .setDescription('sup')
                .setRequired(true)
                return option
        }),

        new SlashCommandBuilder().setName('silentradiuspercentat1').setDescription('Radius percent of screen width at 1 stud for silent aim').addNumberOption(option => {
            option.setName('percent')
                .setDescription('sup')
                .setRequired(true)
                return option
        }),

        new SlashCommandBuilder().setName('ignoretransparent').setDescription('Whether to ignore transparent parts above the threshold or not in wallcheck').addBooleanOption(option => {
            option.setName('boolean')
                .setDescription('sup')
                .setRequired(true)
                return option
        }),

        new SlashCommandBuilder().setName('ignorewater').setDescription('Whether to ignore water in wallcheck').addBooleanOption(option => {
            option.setName('boolean')
                .setDescription('sup')
                .setRequired(true)
                return option
        }),

        new SlashCommandBuilder().setName('transparencythreshold').setDescription('Threshold for what transparency or greater counts as ignorable').addNumberOption(option => {
            option.setName('number')
                .setDescription('sup')
                .setRequired(true)
                return option
        }),

        new SlashCommandBuilder().setName('isalivecheck').setDescription('Ignore dead players').addBooleanOption(option => {
            option.setName('boolean')
                .setDescription('sup')
                .setRequired(true)
                return option
        }),

        new SlashCommandBuilder().setName('xsmoothingpercent').setDescription('X Smoothing percent to move mouse to target').addNumberOption(option => {
            option.setName('percent')
                .setDescription('sup')
                .setRequired(true)
                return option
        }),

        new SlashCommandBuilder().setName('ysmoothingpercent').setDescription('Y Smoothing percent to move mouse to target').addNumberOption(option => {
            option.setName('percent')
                .setDescription('sup')
                .setRequired(true)
                return option
        }),


        new SlashCommandBuilder().setName('teamcheck').setDescription('Ignore teammates').addBooleanOption(option => {
            option.setName('boolean')
                .setDescription('sup')
                .setRequired(true)
                return option
        }),

        new SlashCommandBuilder().setName('targetpart').setDescription('Target for the aimbot').addStringOption(option => {
            option.setName('string')
                .setDescription('Target part, or false')
                .setRequired(true)
                return option
        }),

        new SlashCommandBuilder().setName('triggerbot').setDescription('Triggerbot status').addBooleanOption(option => {
            option.setName('boolean')
                .setRequired(true)
                .setDescription('sup')
                return option
        }),

        new SlashCommandBuilder().setName('invisiblecheck').setDescription('Ignore invisible players').addBooleanOption(option => {
            option.setName('boolean')
                .setDescription('sup')
                .setRequired(true)
                return option
        })

    ]
    .map(command => command.toJSON());

const rest = new REST({
    version: '9'
}).setToken(token);

rest.put(Routes.applicationGuildCommands("966154287975661679", "966154043200266280"), {
        body: commands
    })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);