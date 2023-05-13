const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("nrc.db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("prefix")
        .setDescription("Sunucu için özel bir prefix ayarlar")
        .addStringOption(option =>
            option.setName("yeniprefix")
                .setDescription("Yeni prefixi belirtin")
                .setRequired(true)
        ),
    async execute(interaction, client, embed) {

        const rows = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Premium Üye Ol")
                    .setURL("https://discord.com/users/801069133810237491")
            );

        const premiumUserID = "801069133810237491";

        if (interaction.user.id !== premiumUserID && !db.get(`premium_${interaction.user.id}`)) {
            return interaction.reply({ content: "Bu komutu sadece premium üyeler kullanabilir sende premium üye olmak istersen aşağıdaki butona basarak iletişime geçebilirsin", components: [rows] });
        }

        if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("Bu komutu kullanabilmek için **Yönetici** iznine sahip olmalısın!");

        const newPrefix = interaction.options.getString("newprefix");
        client.guildPrefixes.set(interaction.guild.id, newPrefix);

        return interaction.reply(`Başarıyla sunucu için özel prefix ayarlandı: \`${newPrefix}\``);
    }
};
