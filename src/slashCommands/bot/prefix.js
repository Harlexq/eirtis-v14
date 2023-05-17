const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("nrc.db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("prefix")
        .setDescription("Sunucu için özel bir prefix ayarlar")
        .addSubcommand(subcommand =>
            subcommand.setName('ayarla')
                .setDescription('Ayarlanacak prefixi belirtiniz')
                .addStringOption(option =>
                    option.setName('newprefix')
                        .setDescription('Ayarlanacak prefixi belirtiniz')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('sıfırla')
                .setDescription('Ayarlanan Prefixi Sıfırlar')
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

        const subCommand = interaction.options.getSubcommand();

        if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("Bu komutu kullanabilmek için **Yönetici** iznine sahip olmalısın!");

        if (subCommand === 'ayarla') {

            const newPrefix = interaction.options.getString('newprefix');

            if (newPrefix.length < 1 || newPrefix.length > 3 || !isNaN(newPrefix)) {
                return interaction.reply("Prefix, minimum 1, maksimum 3 karakter uzunluğunda olmalı ve sayı içermemelidir.");
            }

            client.guildPrefixes.set(interaction.guild.id, newPrefix);
            db.set(`prefix_${interaction.guild.id}`, newPrefix);

            return interaction.reply(`Başarıyla sunucu için özel prefix ayarlandı: \`${newPrefix}\``);

        } else if (subCommand === 'sıfırla') {

            client.guildPrefixes.delete(interaction.guild.id);
            db.delete(`prefix_${interaction.guild.id}`);

            return interaction.reply("Sunucu için özel prefix sıfırlandı.");
        }
    }
};
