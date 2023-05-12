const { SlashCommandBuilder } = require('discord.js');;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("ID'sini Girdiğiniz Kişinin Sunucudan Banını Kaldırır")
        .addStringOption(option =>
            option.setName("kişi")
                .setDescription("Banı kaldırılacak kullanıcının ID'si")
                .setRequired(true)
        ),
    async execute(interaction, client, embed) {
        if (!interaction.member.permissions.has("BAN_MEMBERS")) {
            return interaction.reply({
                content: "Bu komutu kullanmak için gerekli izne sahip değilsiniz.",
                ephemeral: true
            });
        }

        const userId = interaction.options.getString("kişi");

        try {
            const user = await interaction.client.users.fetch(userId);
            await interaction.guild.members.unban(user);

            interaction.reply({ embeds: [embed.setDescription(`${user} adlı kullanıcının banı kaldırıldı.`)] });
        } catch (err) {
            interaction.reply({
                content: "Bir hata oluştu. Lütfen tekrar deneyin.",
                ephemeral: true
            });
        }
    }
};
