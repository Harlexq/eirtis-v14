const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('duyuru')
        .setDescription("Sunucuda Bulunan Herkese Bot DM'den Mesaj Atar")
        .addStringOption(option =>
            option.setName('mesaj')
                .setDescription('DM olarak gönderilecek mesaj')
                .setRequired(true)),
    async execute(interaction, client, embed) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            return interaction.reply(
                "Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın."
            );
        }

        const msg = interaction.options.getString('mesaj');

        interaction.guild.members.cache.forEach(member => {
            if (member.id === interaction.client.user.id) return;
            member.send((`
**${interaction.guild.name}** Sunucusunda ${interaction.user} Tarafından Sunucuda Bulunan Herkese Bu Mesaj İletilmiştir
            
**Gönderilen Mesaj**: ${msg}
            `)).catch(err => {
            });
        });

        interaction.reply(`Sunucudaki herkese başarıyla \`${msg}\` mesajı gönderildi.`);
    },
};
