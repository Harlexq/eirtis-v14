const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    conf: {
        aliases: ["clear", "temizle"],
        name: "sil",
        help: "Yazdığınız Sayı Kadar Kanaldan Mesajı Siler",
        category: "moderasyon",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;


        if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply('Üzgünüm, buna yetkin yok :grinning:')

        const silindi = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("silindi")
                    .setLabel("Mesajlar Silindi")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("1086393444315975820")
                    .setDisabled(true)
            );

        const limit = Number(args.join(" "));

        if (!limit) return message.reply('Silinecek mesaj sayısını yazın.')

        if (limit > 100) return message.reply(`100 mesajdan fazla silmek beni zorlar abi, anlayışla karşıla, o yükü kaldıramam, daha az bir sayı yazarsan daha iyi olur. `)

        if (limit < 1) return message.reply(`En azından 1 mesaj silmen gerek.`)

        const messages = await message.channel.messages.fetch({ limit })
        try {
            await message.delete()
            await message.channel.bulkDelete(messages)
            message.channel.send({ content: `${limit} Kadar Mesaj Silindi`, components: [silindi] });

        } catch {

            await message.channel.send(limit + ' kadar mesajı silemedim, büyük ihtimalle mesajlar 14 günden eski!')

        }
    },
}