const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { DiscordTogether } = require('discord-together');

module.exports = {
    conf: {
        aliases: ["etkinlik"],
        name: "etkinlik",
        help: "Sesli Kanallarda Discord'un Etkinliklerini Açar",
        category: "eglence",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;

        if (!args[0]) return message.reply({
            embeds: [embed.setDescription(`
            **e.etkinlik youtube** = YouTube\'den bir şeyler izlemenizi sağlar
            **e.etkinlik poker** = Poker oynamaya ne dersin?
            **e.etkinlik chess** = Santranç oynamak ister misin?
            **e.etkinlik fishing** = Haydi balık tutmaya!
            **e.etkinlik checkers** = Dama oynamayı sever misin?
            **e.etkinlik lettertile** = Kelime oyunlarına ne dersin?
            **e.etkinlik wordsnack** = Başka bir kelime oyunu denemek ister misin?
            **e.etkinlik doodlecrew** = Resim çizmeye ne dersin?
            **e.etkinlik spellcast** = Rekabet oyunları sever misin?
            `)]
        })

        if (!message.member.voice.channel) return message.reply('Kanatlanmak İçin Öncelikle Bir **Ses Kanalına** Bağlanman Gerekli')
        client.discordTogether = new DiscordTogether(client);
        client.discordTogether.createTogetherCode(message.member.voice.channel.id, args[0]).catch(error => message.reply('Bu İsimde Bir etkinlik Yok')).then(async invite => {
            const link = invite.code
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Aktiviteyi Aç')
                        .setStyle(ButtonStyle.Link)
                        .setURL(link)
                )

            message.reply({ embeds: [embed.setDescription(`Etkinlik Açıldı Butona Tıklayarak Gidebilirsin`)], components: [row] })
        })


    },
}