const { SlashCommandBuilder } = require('discord.js');;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("move")
        .setDescription("Kullanıcıyı Başka Bir Sesli Kanala Taşır")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Taşınacak kullanıcı")
                .setRequired(true))
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("Taşınacak sesli kanal")
                .setRequired(true)),
    async execute(interaction, client, embed) {
        if (!interaction.member.permissions.has("MOVE_MEMBERS")) {
            return interaction.reply("Üyeleri Taşıma yetkiniz yok.");
        }

        const user = interaction.options.getUser("user");
        const channel = interaction.options.getChannel("channel");

        if (!user.voice.channel) {
            return interaction.reply("Bu kullanıcı bir ses kanalında değil.");
        }

        try {
            await user.voice.setChannel(channel);
            return interaction.reply(`${user} adlı kullanıcı başarıyla ${channel} adlı kanala taşındı.`);
        } catch (error) {
            return interaction.reply("Kullanıcı taşınamadı.");
        }
    },
};
