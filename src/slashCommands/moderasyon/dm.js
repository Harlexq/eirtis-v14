const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dm')
        .setDescription("Etiketlenen Kullanıcıya Bot DM'den Mesaj Atar")
        .addUserOption(option =>
            option.setName('kullanıcı')
                .setDescription('DM gönderilecek kullanıcı')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('mesaj')
                .setDescription('DM olarak gönderilecek mesaj')
                .setRequired(true)),
    async execute(interaction, client, embed) {
        const user = interaction.options.getUser('kullanıcı');
        const msg = interaction.options.getString('mesaj');
        try {
            await user.send(`
**${interaction.guild.name}** Sunucusunda ${interaction.user} Tarafından Sana Bir Mesaj Gönderildi

**Gönderilen Mesaj**: ${msg}`
            );
            interaction.reply(`\`${user.tag}\` kullanıcısına başarıyla mesaj gönderildi.`);
        } catch (err) {
            interaction.reply(`\`${user.tag}\` kullanıcısına mesaj gönderirken bir hata oluştu: ${err}`);
        }
    },
};
