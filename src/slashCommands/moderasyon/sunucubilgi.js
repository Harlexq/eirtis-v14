const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const moment = require("moment");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sunucubilgi')
        .setDescription('Sunucu Bilgilerini Gösterir'),
    async execute(interaction, client, embed) {
        const guild = await interaction.guild.fetch();
        const sunucuOlusturmaTarihi = moment(guild.createdAt).format("LLL");
        const kanalSayisi = guild.channels.cache.size;
        const textKanalSayisi = guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size;
        const sesKanalSayisi = guild.channels.cache.filter((c) => c.type === "GUILD_VOICE").size;
        const kategoriSayisi = guild.channels.cache.filter((c) => c.type === "GUILD_CATEGORY").size;
        const rolSayisi = guild.roles.cache.size;
        const emojiSayisi = guild.emojis.cache.size;
        const boostSayisi = guild.premiumSubscriptionCount;
        const sunucuResmi = guild.iconURL({ dynamic: true }) || "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png";

        const sunucuBilgiEmbed = new EmbedBuilder()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true, size: 2048 }) })
            .setColor("White")
            .setTimestamp()
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true, size: 2048 }) })
            .setThumbnail(sunucuResmi)
            .setTitle(`${guild.name} Sunucu Bilgileri`)
            .setDescription(`
            **Sunucu ID:** \`${guild.id}\`
            **Sunucu Sahibi** = <@${interaction.guild.ownerId}>
            **Sunucu Oluşturma Tarihi** = \`${sunucuOlusturmaTarihi}\`
            **Toplam Kanal Sayısı** = \`${kanalSayisi}\`
            **Metin Kanalı Sayısı** = \`${textKanalSayisi}\`
            **Ses Kanalı Sayısı** = \`${sesKanalSayisi}\`
            **Kategori Sayısı** = \`${kategoriSayisi}\`
            **Toplam Rol Sayıs** = \`${rolSayisi}\`
            **Toplam Emoji Sayısı** = \`${emojiSayisi}\`
            **Boost Sayısı** = \`${boostSayisi}\`
            `);
        return interaction.reply({ embeds: [sunucuBilgiEmbed] });
    },
};