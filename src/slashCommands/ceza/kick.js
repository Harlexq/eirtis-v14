const { SlashCommandBuilder } = require('discord.js');;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Etiketlenen Kişiyi Sunucudan Atar")
        .addUserOption(option => option
            .setName("kullanıcı")
            .setDescription("Atılacak kullanıcıyı etiketleyin.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("sebep")
            .setDescription("Atılma sebebini girin.")
            .setRequired(true)),
    async execute(interaction, client, embed) {
        const member = interaction.options.getMember("kullanıcı");
        const reason = interaction.options.getString("sebep");

        if (!interaction.member.permissions.has("KICK_MEMBERS")) {
            return interaction.reply({ content: "Üyeleri Atma Yetkiniz Yok.", ephemeral: true });
        }

        if (!member) {
            return interaction.reply({ content: "Geçersiz kullanıcı etiketi.", ephemeral: true });
        }

        if (!member.kickable) {
            return interaction.reply({ content: "Bu kullanıcı sunucuda değil.", ephemeral: true });
        }

        if (member.user.id === interaction.user.id) {
            return interaction.reply("Kendinizi Atamazsınız.");
        }

        if (member.user.id === interaction.client.user.id) {
            return interaction.reply("Beni Atamazsın.");
        }

        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply("Belirttiğiniz kişi sizinle aynı yetkiye sahip veya sizden daha yetkili.");
        }

        if (member.roles.highest.position >= interaction.guild.me.roles.highest.position) {
            return interaction.reply("Belirttiğiniz kişi botun yetkisiyle aynı veya daha üst bir yetkiye sahip.");
        }

        await member.kick(reason);

        interaction.reply({
            embeds: [embed.setDescription(`
        ${member.user.username}, **${interaction.guild.name}** Sunucusundan Başarıyla Atıldı
        **Atılma Sebebi:** ${reason}
        **Atan Kişi:** ${interaction.user}
        `)]
        });
    }
};