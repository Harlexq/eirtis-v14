module.exports = {
    conf: {
        aliases: ["setcolor"],
        name: "setcolor",
        help: "Etiketlenen Rolün Rengini Değiştirir",
        category: "moderasyon",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;

        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply({ content: `Yetkin bulunmamakta dostum.`, ephemeral: true });
        }

        const role = message.mentions.roles.first();
        let color = args[1];
        if (!role || !color) {
            return message.reply({
                content:
                    "Lütfen bir rol etiketleyin ve hex kodu ile renk belirtin!"
            });
        }

        if (!/^#?([0-9a-fA-F]{6})$/.test(color)) {
            if (!/^#?([0-9a-fA-F]{3})$/.test(color)) {
                return message.reply({ content: "Lütfen geçerli bir hex kodu ile renk belirtin!" });
            } else {
                color = color.replace(/^#?([0-9a-fA-F]{3})$/, "#$1$1");
                message.reply({ content: `Renk kodu 6 haneli olmadığı için kodu 3 haneliden 6 haneliye çevrildi: \`${color}\`` });
            }
        }

        role.setColor(color);

        message.reply({
            content:
                `${role} rolünün rengi başarıyla \`${color}\` olarak değiştirildi.`
        });
    },
};
