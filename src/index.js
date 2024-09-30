const { Client, GatewayIntentBits } = require("discord.js");
const path = require("path");
require("dotenv").config();
const fs = require("fs");

const commandPath = path.join(__dirname, "commands");
const eventsPath = path.join(__dirname, "events");
const token = process.env.TOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers
    ]
});

client.login(token);

console.log("Nexus Online");
