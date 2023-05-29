const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setcolor')
        .setDescription('Etiketlenen Rolün Rengini Değiştirir')
        .addRoleOption(option =>
            option.setName('rol')
                .setDescription('Rengi değiştirilecek rolü etiketleyin')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('renk')
                .setDescription('Yeni rol rengini hex kodu ile belirtin')
                .setRequired(true)),
    async execute(interaction, client, embed) {
        if (!interaction.guild) return;

        const role = interaction.options.getRole('rol');
        let color = interaction.options.getString('renk');

        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'Bu işlem için yeterli yetkiye sahip değilsin.', ephemeral: true });
        }

        if (!/^#?([0-9a-fA-F]{6})$/.test(color)) {
            if (!/^#?([0-9a-fA-F]{3})$/.test(color)) {
                return interaction.reply({ content: "Lütfen geçerli bir hex kodu ile renk belirtin!", ephemeral: true });
            } else {
                color = color.replace(/^#?([0-9a-fA-F]{3})$/, "#$1$1");
                interaction.reply({ content: `Renk kodu 6 haneli olmadığı için kodu 3 haneliden 6 haneliye çevrildi: \`${color}\``, ephemeral: true });
            }
        }

        await role.setColor(color);

        await interaction.reply({
            content:
                `${role} rolünün rengi başarıyla \`${color}\` olarak değiştirildi.`
        });
    },
};
