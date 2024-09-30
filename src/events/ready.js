
const { Events, ActivityType, REST, Routes } = require("discord.js");
const fs = require("node:fs");
require("dotenv").config();

const clientId = process.env.CLIENTID;
const token = process.env.TOKEN;

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        
        const activities = [
            { name: `${client.guilds.cache.size} servers!`, type: ActivityType.Watching },
            { name: "Nexus ", type: ActivityType.Playing }
        ];
        let currentIndex = 0;

        setInterval(() => {
            const { name, type } = activities[currentIndex];
            client.user.setPresence({
                activities: [{ name, type }],
                status: "Online"
            });
            currentIndex = (currentIndex + 1) % activities.length;
        }, 10 * 1000); 

        // Refresh Application Commands
        const commands = [];
        const commandFiles = fs.readdirSync("./src/commands").filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            if (command.data && typeof command.data.toJSON === "function") {
                commands.push(command.data.toJSON());
            } else {
                console.error(` Invalid data structure in command file: ${file}`);
            }
        }

        const rest = new REST({ version: "10" }).setToken(token);
        try {
            console.log(`refreshing ${commands.length} application (/) commands.`);
            const data = await rest.put(Routes.applicationCommands(clientId), {
                body: commands,
            });
            console.log(`Reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(` Error occurred during the refreshing/registration of application commands:`, error);
        }
    },
};
