const db = require("nrc.db");

module.exports = {
    conf: {
        aliases: ["cf"],
        name: "coinflip",
        help: "Belirttiğiniz miktar kadar coinflip oynar.",
        category: "ekonomi",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;

        const user = message.mentions.users.first() || message.author;
        const account = db.fetch(`hesap_${user.id}`);
        if (!account) return message.reply(`Kullanıcının hesabı yok. Lütfen önce bir hesap oluşturun. \`e.hesap kur [isim]\``);

        const coin = db.fetch(`coin_${user.id}`) || 0;
        const minBet = 5;
        const maxBet = 15000;
        const betAmount = parseInt(args[0]);

        if (!betAmount || isNaN(betAmount) || betAmount < minBet || betAmount > maxBet) {
            return message.reply(`Geçerli bir bahis miktarı belirtmelisin! (${minBet}-${maxBet} aralığında)`);
        }

        const lastBet = db.get(`lastBet_${user.id}`) || 0;
        const betCooldown = 5000;
        if (Date.now() - lastBet < betCooldown) {
            const remainingTime = Math.ceil((betCooldown - (Date.now() - lastBet)) / 1000);
            return message.reply(`Son bahisinden sonra ${remainingTime} saniye beklemelisin!`);
        }

        if (betAmount > coin) {
            return message.reply(`Yeterli coinin yok! Hesabında ${coin} coin var.`);
        }

        const result = Math.floor(Math.random() * 2);
        const outcome = result === 0 ? "Kazandın" : "Kaybettin";

        let winnings = 0;
        if (result === 0) {
            winnings = betAmount * 2;
            db.add(`coin_${user.id}`, winnings);
            message.reply(`Tebrikler! ${outcome} ve ${winnings} coin kazandın!`);
        } else {
            db.add(`coin_${user.id}`, -betAmount);
            message.reply(`Maalesef ${outcome} ve ${betAmount} coin kaybettin.`);
        }

        db.set(`lastBet_${user.id}`, Date.now());

    },
};