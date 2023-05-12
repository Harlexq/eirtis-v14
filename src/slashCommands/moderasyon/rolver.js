const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolver')
        .setDescription('Etiketlediğiniz Kullanıcıdan Etiketlediğiniz Rolü Verir')
        .addUserOption(option => option.setName('kullanıcı')
            .setDescription('Rol verilecek kullanıcıyı seçin')
            .setRequired(true))
        .addRoleOption(option => option.setName('rol')
            .setDescription('Verilecek rolü seçin')
            .setRequired(true)),
    async execute(interaction, client, embed) {
        if (!interaction.member.permissions.has("MANAGE_ROLES")) return interaction.reply({ content: "Rolleri Yönet Yetkiniz Bulunmamakta." });

        const user = interaction.options.getUser('kullanıcı');
        const role = interaction.options.getRole('rol');

        await interaction.guild.members.cache.get(user.id).roles.add(role.id);

        interaction.reply({ embeds: [embed.setDescription(`${user}, isimli kişiye ${role} isimli rol verildi.`)] });
    },
};
