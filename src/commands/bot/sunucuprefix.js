const db = require("nrc.db");

module.exports = {
    conf: {
        aliases: ["swprefix", "sunucuprefix", "serverprefix", "swprefix"],
        name: "sunucuprefix",
        help: "Sunucu İçi Ayarlanmış Özel Prefixi Gösterir",
        category: "bot"
    },

    run: async (client, message, args, embed) => {
        const guildPrefix = db.get(`prefix_${message.guild.id}`);
        const prefix = guildPrefix !== null ? guildPrefix : "Özel prefix ayarlanmamış ayarlamak için e.prefix ayarla <yeniprefix>";
        return message.reply(`Sunucu için ayarlanmış prefix: \`${prefix}\``);
    }
}
