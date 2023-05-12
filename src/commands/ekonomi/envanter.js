const db = require("nrc.db")

module.exports = {
    conf: {
        aliases: ["envanterim", "çanta"],
        name: "envanter",
        help: "Etiketlenen Kullanıcının Veya Sizin Envanterinizi Gösterir",
        category: "ekonomi",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;

        let userx = message.mentions.users.first() || message.author;
        let account = db.fetch(`hesap_${userx.id}`);

        if (!account) return message.reply(`Kullanıcının hesabı yok. Lütfen önce bir hesap oluşturun. \`e.hesap kur [isim]\``);

        let kazma = db.fetch(`kazma_${message.author.id}`) || 0;
        let balta = db.fetch(`balta_${message.author.id}`) || 0;
        let elmas = db.fetch(`elmas_${message.author.id}`) || 0;
        let altın = db.fetch(`altın_${message.author.id}`) || 0;
        let demir = db.fetch(`demir_${message.author.id}`) || 0;
        let kömür = db.fetch(`kömür_${message.author.id}`) || 0;
        let odun = db.fetch(`odun_${message.author.id}`) || 0;

        message.reply({ embeds: [embed.setDescription(`**Kazma:** ${kazma}\n**Balta:** ${balta}\n**Elmas:** ${elmas}\n**Altın:** ${altın}\n**Demir:** ${demir}\n**Kömür:** ${kömür}\n**Odun:** ${odun}`)] })
    },
}
