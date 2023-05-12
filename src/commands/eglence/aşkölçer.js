module.exports = {
    conf: {
        aliases: ["askölcer", "askolcer"],
        name: "aşkölçer",
        help: "Etiketlediğiniz Veya Random Biriyle Aşk Ölçer",
        category: "eglence",
    },

    run: async (client, message, args, embed) => {


        let member;
        if (message.mentions.members.size) {
            member = message.mentions.members.first();
        } else {
            const members = await message.guild.members.fetch();
            member = members.random();
        }

        const tahmin = Math.floor(Math.random() * 99) + 1;
        let kalp, yorum;

        if (tahmin <= 25) {
            kalp = `❤️ 🖤 🖤 🖤 🖤 🖤 `;
            yorum = "Bu iş olmaz sen bunu unut.";
        } else if (tahmin >= 25 && tahmin < 50) {
            kalp = `❤️ ❤️ 🖤 🖤 🖤 🖤 `;
            yorum = "Azıcıkta olsa bir şeyler hissediyor sana :)";
        } else if (tahmin >= 50 && tahmin < 75) {
            kalp = `❤️ ❤️ ❤️ 🖤 🖤 🖤 `;
            yorum = "Eh biraz biraz bir şeyler var gibi.";
        } else if (tahmin >= 75 && tahmin < 85) {
            kalp = `❤️ ❤️ ❤️ ❤️ 🖤 🖤 `;
            yorum = "Biraz daha uğraşırsan bu iş olacak gibi :)";
        } else if (tahmin >= 85 && tahmin < 100) {
            kalp = `❤️ ❤️ ❤️ ❤️ ❤️ 🖤 `;
            yorum = "Oluyor gibi :))";
        } else if (tahmin === 100) {
            kalp = `❤️ ❤️ ❤️ ❤️ ❤️ ❤️ `;
            yorum = "Sizi evlendirelim <3";
        }


        message.reply({
            embeds: [embed.setTitle('Aşk Ölçer')
                .setDescription(`Aşk Yüzdesi: **${tahmin}%**\n\n${kalp}\n\n${yorum}\n\n${message.author} ile ${member} eşleştiniz. ${yorum}\n\n`)
            ]
        });


    },
}