const { Client, GatewayIntentBits, Collection } = require("discord.js");
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
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildModeration
    ]
});

client.commands = new Collection();


const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    const execute = (...args) => event.execute(...args, client);
    if (event.once) {
        client.once(event.name, execute);
    } else {
        client.on(event.name, execute);
    }
}


const commandFiles = fs.readdirSync(commandPath).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const filePath = path.join(commandPath, file);
    const command = require(filePath);
    if (command.data && command.data.name) {
        client.commands.set(command.data.name, command);
    }
}


client.login(token).then(() => {
    console.log("Nexus Online");
}).catch(console.error);
