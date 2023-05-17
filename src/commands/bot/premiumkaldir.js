const db = require("nrc.db");

module.exports = {
    conf: {
        aliases: ["premiumkaldir"],
        name: "premiumkaldir",
        help: "Kullanıcının premium üyeliğini kaldırır",
        category: ""
    },

    run: async (client, message, args, embed) => {
        if (message.author.id !== "801069133810237491") return;

        let userID = args[0];

        if (!userID) return message.reply(`${message.author.username}, lütfen bir kullanıcının ID'sini belirtin.`);

        userID = userID.replace(/[^\d]/g, '');

        let isPremium = db.get(`premium_${userID}`);

        if (!isPremium) return message.reply(`${message.author.username}, bu kullanıcının zaten premium üyeliği yok.`);

        db.delete(`premium_${userID}`);

        message.reply(`${message.author.username}, başarıyla kullanıcının premium üyeliğini kaldırdınız.`);
    }
}
