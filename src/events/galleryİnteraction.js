const db = require('nrc.db');

module.exports = async (interaction) => {
    if (!interaction.isButton()) return;
    if (!interaction.guild) return;

    const dbKey = `gallery_${interaction.guild.id}`;
    const galleryChannelId = await db.get(dbKey);

    if (!galleryChannelId) return;
    if (interaction.channel.id !== galleryChannelId) return;

    if (interaction.customId === 'clear') {
        const messages = await interaction.channel.messages.fetch({ limit: 100 });
        const filteredMessages = messages.filter((msg) => msg.author.id === client.user.id);

        if (filteredMessages.size === 0) return;

        await interaction.channel.bulkDelete(filteredMessages);

        await interaction.channel.send({
            content: `Galeri kanalı temizlendi.`,
            ephemeral: true
        });
    }
}

module.exports.conf = {
    name: "interactionCreate",
};
