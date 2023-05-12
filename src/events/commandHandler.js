const client = global.client;
const { EmbedBuilder } = require("discord.js");
const settings = require("../configs/settings.json");
const cooldowns = new Map();

module.exports = async (message) => {
    const prefixes = settings.prefix;
    const prefix = prefixes.find(p => message.content.startsWith(p));
    if (!prefix) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.has(commandName) ? client.commands.get(commandName) : client.commands.get(client.aliases.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName)));
    if (!command) return;

    const now = Date.now();
    const userCooldowns = cooldowns.get(message.author.id) || new Map();
    const cooldownTime = 3000;
    if (userCooldowns.has(commandName)) {
        const expirationTime = userCooldowns.get(commandName) + cooldownTime;
        if (now < expirationTime) {
            const remainingTime = expirationTime - now;
            return message.reply(`${message.author}, Bu komutu tekrar kullanabilmek için **${(remainingTime / 1000).toFixed(2)}** daha beklemelisin`)
                .then((reply) => {
                    setTimeout(() => {
                        reply.delete();
                    }, remainingTime);
                });
        }
    }

    userCooldowns.set(commandName, now);
    cooldowns.set(message.author.id, userCooldowns);

    const embed = new EmbedBuilder()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
        .setColor("White")
        .setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
        .setTimestamp()
        .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) });
    command.run(client, message, args, embed);
}

module.exports.conf = {
    name: "messageCreate",
};