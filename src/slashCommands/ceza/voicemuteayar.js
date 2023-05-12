const { SlashCommandBuilder } = require('discord.js');;
const db = require("nrc.db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("voicemuteayar")
        .setDescription("Voice Mute Sistemini Ayarla")
        .addSubcommand(subcommand =>
            subcommand
                .setName("rol")
                .setDescription("Voice Mute atılan kişiye verilecek rolü belirtin.")
                .addRoleOption(option => option.setName("rol").setDescription("Voice Mute rolü").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("voicemute-yetkilisi")
                .setDescription("Voice Mute atabilecek rolü belirtin.")
                .addRoleOption(option => option.setName("rol").setDescription("Voice Mute yetkili rolü").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("log")
                .setDescription("Voice Mute atıldığında log kanalını belirtin.")
                .addChannelOption(option => option.setName("kanal").setDescription("Voice Mute log kanalı").setRequired(true))
        ),
    async execute(interaction, client, embed) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.");

        const subcommand = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;

        switch (subcommand) {
            case "rol": {
                const role = interaction.options.getRole("rol");
                if (!role) return interaction.reply({ content: "Lütfen bir **Voice Mute** rolü belirleyiniz.", ephemeral: true });
                db.set(`voicemute_rol_${guildId}`, role.id);
                interaction.reply({ content: `Voice Mute atıldığında kişinin tüm rollerini alıp ${role} isimli rolü vericeğim.`, ephemeral: true });
                break;
            }
            case "voicemute-yetkilisi": {
                const role = interaction.options.getRole("rol");
                if (!role) return interaction.reply({ content: "Lütfen bir **Voice Mute Yetkilisi** rolü belirleyiniz.", ephemeral: true });
                db.set(`voicemute_yetkilirol_${guildId}`, role.id);
                interaction.reply({ content: `Voice Mute Yetkilisi ${role} Olarak Ayarlandı`, ephemeral: true });
                break;
            }
            case "log": {
                const channel = interaction.options.getChannel("kanal");
                if (!channel) return interaction.reply({ content: "Lütfen bir **Voice Mute Log Kanalı** belirleyiniz.", ephemeral: true });
                db.set(`voicemute_kanal_${guildId}`, channel.id);
                interaction.reply({ content: `Voice Mute Atılınca Log Kanalı ${channel} Olarak Ayarlandı.`, ephemeral: true });
                break;
            }
        }
    },
};
