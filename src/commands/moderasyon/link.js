module.exports = {
    conf: {
        aliases: ["url"],
        name: "link",
        help: "Sunucunun Özel Url Kullanımını Gösteririr",
        category: "moderasyon",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;

        const guild = message.guild;
        if (!guild.vanityURLCode)
            return message.reply({ content: "Sunucuda Bir Özel Url Yok" });
        const url = await guild.fetchVanityData();

        message.reply({
            embeds: [embed.setTitle(`${guild.name} Sunucusunun Özel URL Kullanımı`)
                .setDescription(
                    `**URL:** discord.gg/${guild.vanityURLCode}\n**Toplam Kullanım:** ${url.uses}`
                )]
        });
    },
}