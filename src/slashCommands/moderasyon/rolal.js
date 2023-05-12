const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolal')
        .setDescription('Etiketlediğiniz Kullanıcıdan Etiketlediğiniz Rolü Alır')
        .addUserOption(option =>
            option.setName('kullanıcı')
                .setDescription('Rolün alınacağı kullanıcı')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('rol')
                .setDescription('Alınacak rol')
                .setRequired(true)),
    async execute(interaction, client, embed) {
        if (!interaction.member.permissions.has('MANAGE_ROLES')) {
            return await interaction.reply('Rolleri Yönet yetkiniz bulunmamakta.');
        }

        const user = interaction.options.getUser('kullanıcı');
        const rol = interaction.options.getRole('rol');

        try {
            await interaction.guild.members.cache.get(user.id).roles.remove(rol);
            return await interaction.reply({ embeds: [embed.setDescription(`${user} isimli kişiden ${rol} isimli rol alındı.`)] });
        } catch (error) {
            return await interaction.reply({ content: 'Bir hata oluştu.', ephemeral: true });
        }
    },
};
