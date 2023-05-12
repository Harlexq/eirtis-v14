const db = require("nrc.db")

module.exports = {
    conf: {
        aliases: ["coin-gönder"],
        name: "coingönder",
        help: "Etiketlediğiniz Kullanıcıya Coin Gönderir",
        category: "ekonomi",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;

        let userx = message.mentions.users.first() || message.author;
        let account = db.fetch(`hesap_${userx.id}`);

        if (!account) return message.reply(`Kullanıcının hesabı yok. Lütfen önce bir hesap oluşturun. \`e.hesap kur [isim]\``);

        let coin = db.fetch(`coin_${message.author.id}`)
        let miktar = args[1]

        let user = message.mentions.users.first();

        if (!user) return message.reply(`Lütfen gönderilecek kişiyi etiketleyin. Kullanım: !coin-gönder @kullanıcı <miktar>`)
        if (message.author.id === user.id) return message.reply(`Kendinize para gönderemezsiniz.`)
        if (user.bot === true) return message.reply(`Bir bota coin gönderemezsiniz.`)
        if (!miktar) return message.reply(`Lütfen gönderilecek miktarı girin. Kullanım: !coin-gönder @kullanıcı <miktar>`)
        if (isNaN(miktar)) return message.reply(`Gönderilecek miktar sayı ile olmalıdır.`)
        if (coin < miktar) return message.reply(`Gönderilecek miktar cüzdanınızda yok. Cüzdanınızda ${coin} coin bulunmaktadır.`)
        if (miktar < 1) return message.reply(`Gönderilecek miktar en az 1 olmalıdır.`)
        if (miktar > 1000) return message.reply(`Gönderilecek miktar en fazla 1000 olabilir.`)

        db.add(`coin_${message.author.id}`, -Number(miktar))
        let kontrol = db.fetch(`coin_${user.id}`)
        if (!kontrol) db.set(`coin_${user.id}`, 0)
        db.add(`coin_${user.id}`, Number(miktar))
        message.reply(`Başarılı bir şekilde **${miktar}** miktar coin ${user} isimli kişiye gönderildi.`)

    },
}