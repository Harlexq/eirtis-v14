const { SlashCommandBuilder } = require('discord.js');;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vkick")
        .setDescription("Kullanıcıyı Sesli Kanaldan Atar")
        .addUserOption(option =>
            option.setName('kullanıcı')
                .setDescription('Atılacak kullanıcı')
                .setRequired(true)),
    async execute(interaction, client, embed) {
        const user = interaction.options.getMember('kullanıcı');

        if (!interaction.member.permissions.has("MOVE_MEMBERS")) {
            await interaction.reply("Üyeleri Taşıma yetkiniz yok.");
            return;
        }

        if (!user || !user.voice || !user.voice.channel) {
            await interaction.reply("Bu kullanıcı bir ses kanalında değil.");
            return;
        }

        try {
            await user.voice.disconnect();
            await interaction.reply(`${user} adlı kullanıcı başarıyla atıldı.`);
        } catch (error) {
            await interaction.reply("Kullanıcı atılamadı.");
        }
    },

};
