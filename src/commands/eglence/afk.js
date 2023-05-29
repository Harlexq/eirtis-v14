const afk = require("../../schemas/afk");

module.exports = {
    conf: {
        aliases: ["afk"],
        name: "afk",
        help: "AFK Moduna Sokar",
        category: "eglence",
    },

    run: async (client, message, args, embed) => {
        if (message.member.displayName.includes("[AFK]")) return

        const reason = args.join(" ") || "Belirtilmedi!";

        await afk.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $set: { reason, date: Date.now() } }, { upsert: true });

        message.reply({ content: "Başarıyla afk moduna girdiniz! Bir şey yazana kadar [AFK] kalacaksınız." }).then((e) => setTimeout(() => { e.delete(); }, 10000));

        if (message.member.manageable) message.member.setNickname(`[AFK] ${message.member.displayName}`);
    },
}