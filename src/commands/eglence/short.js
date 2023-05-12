const { shorten } = require('isgd');

module.exports = {
        conf: {
                aliases: ["kısa-link", "kısa-url"],
                name: "short",
                help: "Yazdığınız Linki Kısaltır",
                category: "eglence",
        },

        run: async (client, message, args, embed) => {
                if (!message.guild) return;

                const url = args[0];
                if (!url) {
                        return message.reply({ embeds: [embed.setDescription("Lütfen bir link girin!")] });
                }

                shorten(url, async function (res, err) {
                        if (err) {
                                return message.reply({ embeds: [embed.setDescription("Bir hata oluştu! Lütfen daha sonra tekrar deneyin.")] });
                        }
                        return message.reply({ embeds: [embed.setDescription(`Kısaltılmış Link: **<${res}>**`)] });
                });

        },
}
