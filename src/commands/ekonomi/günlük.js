const db = require("nrc.db")
const moment = require("moment")
moment.locale("tr")

module.exports = {
    conf: {
        aliases: ["daily"],
        name: "günlük",
        help: "Günlük 200 Ve 1000 Arasında Coin Verir",
        category: "ekonomi",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;

        let userx = message.mentions.users.first() || message.author;
        let account = db.fetch(`hesap_${userx.id}`);

        if (!account) return message.reply(`Kullanıcının hesabı yok. Lütfen önce bir hesap oluşturun. \`e.hesap kur [isim]\``);

        let kontrol = Number(db.fetch(`günlük_${message.author.id}`))
        if (kontrol > moment.utc().format("X")) {
            message.reply(`Bir Sonraki Günlük Ödül için Süreniz: <t:${kontrol}:R> (<t:${kontrol}:F>)`)
        } else {
            let coinMiktarı = Math.floor(Math.random() * 801) + 200;
            let kontrol2 = Number(db.fetch(`coin_${message.author.id}`))
            if (!kontrol2) db.set(`coin_${message.author.id}`, 0)

            db.add(`coin_${message.author.id}`, coinMiktarı)
            db.set(`günlük_${message.author.id}`, moment.utc().add(1, 'day').format("X"))
            message.reply(`Başarılı bir şekilde ${coinMiktarı} coin günlük ödülünüzü aldınız.`)
        }
    },
}
