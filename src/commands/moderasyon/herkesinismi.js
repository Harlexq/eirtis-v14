module.exports = {
    conf: {
        aliases: ["herkesinismi"],
        name: "herkesinismi",
        help: "Sunucudaki Herkesin İsmini Değiştirir",
        category: "moderasyon"
    },

    run: async (client, message, args) => {
        const newNickname = args.join(" ");
        if (!newNickname) return message.reply("Lütfen yeni isim girin.");

        message.guild.members.cache.forEach(async (member) => {
            if (member.manageable && !member.user.bot) {
                await member.setNickname(`${newNickname}`);
            }
        });

        message.reply(`Tüm kullanıcıların ismi "${newNickname}" olarak değiştirildi.`);
    }
}
