const db = require("nrc.db");

module.exports = {
    conf: {
        aliases: ["premiumekle"],
        name: "premiumekle",
        help: "Kullanıcıyı premium üye listesine ekler",
        category: ""
    },

    run: async (client, message, args, embed) => {
        if (message.author.id !== "801069133810237491") return;

        let userID = args[0];

        if (!userID) return message.reply(`${message.author.username}, lütfen bir kullanıcının ID'sini belirtin.`);

        let isPremium = db.get(`premium_${userID}`);

        if (isPremium) return message.reply(`${message.author.username}, bu kullanıcı zaten premium üye.`);
        db.set(`premium_${userID.replace(/[^\d]/g, '')}`, true);

        message.reply(`${message.author.username}, başarıyla kullanıcıyı premium üye listesine eklediniz.`);
    }
}