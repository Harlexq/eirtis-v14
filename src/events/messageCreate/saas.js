const db = require("nrc.db")

module.exports = async (message) => {

    if (!message.guild) return;
    
    let saas = db.fetch(`saas_${message.guild.id}`)

    if (saas == true) {

        var sa = ["sa", "SA", "Sa", "Sea", "sea", "Selamın Aleyküm", "selamın aleyküm", "SELAMIN ALEKYÜM", "Selam", "selam", "SELAM"]

        if (sa.includes(message.content.toLowerCase())) {
            message.reply(`Aleyküm Selam Hoşgeldin Dostum`)
        }

    }
};

module.exports.conf = {
    name: "messageCreate",
};
