const client = global.client;
const { EmbedBuilder } = require("discord.js");

module.exports = async (interaction) => {
    if (interaction.isCommand()) {
        const command = client.slashcommands.get(interaction.commandName);
        if (interaction.user.bot) return;
        if (!interaction.inGuild() && interaction.isCommand()) return interaction.reply({ content: 'Komutları kullanmak için bir sunucuda olmanız gerekir.' });
        if (!command) return interaction.reply({ content: 'Bu komut kullanılamıyor.', ephemeral: true }) && client.slashcommands.delete(interaction.commandName);

        const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true, size: 2048 }) })
            .setColor("White")
            .setThumbnail(interaction.user.avatarURL({ dynamic: true, size: 2048 }))
            .setTimestamp()
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true, size: 2048 }) });

        try {
            command.execute(interaction, client, embed);
        }
        catch (e) {
            console.log(e);
            return interaction.reply({ content: `Bir Hata Oluştu\n\n**\`${e.message}\`**` });
        }
    }
}

module.exports.conf = {
    name: "interactionCreate",
};