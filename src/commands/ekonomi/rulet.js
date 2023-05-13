const db = require("nrc.db");

module.exports = {
    conf: {
        aliases: ["rulet"],
        name: "rulet",
        help: "Belirttiğiniz miktar kadar rulet oynar.",
        category: "ekonomi",
    },

    run: async (client, message, args) => {
        const user = message.author;
        const account = db.fetch(`hesap_${user.id}`);
        if (!account) return message.reply(`Kullanıcının hesabı yok. Lütfen önce bir hesap oluşturun. \`e.hesap kur [isim]\``);

        const coin = db.fetch(`coin_${user.id}`) || 0;
        const minBet = 5;
        const maxBet = 15000;
        const betAmount = parseInt(args[0]);

        if (!betAmount || isNaN(betAmount) || betAmount < minBet || betAmount > maxBet) {
            return message.reply(`Geçerli bir bahis miktarı belirtmelisin! (${minBet}-${maxBet} aralığında)`);
        }

        if (betAmount > coin) {
            return message.reply(`Yeterli coinin yok! Hesabında ${coin} coin var.`);
        }

        const result = Math.floor(Math.random() * 36);
        const isEven = result % 2 === 0;

        let winnings = 0;
        if (isEven) {
            winnings = betAmount * 2;
            db.add(`coin_${user.id}`, winnings);
            message.reply(`Tebrikler! Çift sayı olan ${result} geldi ve ${winnings} coin kazandın!`);
        } else {
            db.add(`coin_${user.id}`, -betAmount);
            message.reply(`Maalesef tek sayı olan ${result} geldi ve ${betAmount} coin kaybettin.`);
        }
    },
};
