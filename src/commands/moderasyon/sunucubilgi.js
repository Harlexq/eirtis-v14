const { EmbedBuilder } = require("discord.js");
const moment = require("moment");

module.exports = {
    conf: {
        aliases: ["sunucu-bilgi", "sunucuinfo", "sunucu-info", "sb"],
        name: "sunucubilgi",
        help: "Sunucu Bilgilerini Gösterir",
        category: "moderasyon",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;

        const guild = await message.guild.fetch();
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
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
            .setColor("White")
            .setTimestamp()
            .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
            .setThumbnail(sunucuResmi)
            .setTitle(`${guild.name} Sunucu Bilgileri`)
            .setDescription(`
            **Sunucu ID:** \`${guild.id}\`
            **Sunucu Sahibi** = <@${message.guild.ownerId}>
            **Sunucu Oluşturma Tarihi** = \`${sunucuOlusturmaTarihi}\`
            **Toplam Kanal Sayısı** = \`${kanalSayisi}\`
            **Metin Kanalı Sayısı** = \`${textKanalSayisi}\`
            **Ses Kanalı Sayısı** = \`${sesKanalSayisi}\`
            **Kategori Sayısı** = \`${kategoriSayisi}\`
            **Toplam Rol Sayıs** = \`${rolSayisi}\`
            **Toplam Emoji Sayısı** = \`${emojiSayisi}\`
            **Boost Sayısı** = \`${boostSayisi}\`
            `);
        return message.reply({ embeds: [sunucuBilgiEmbed] });

    },
}