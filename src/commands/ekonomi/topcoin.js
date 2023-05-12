const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const db = require("nrc.db");
const Canvas = require("canvas");

module.exports = {
    conf: {
        aliases: ["topdolar", "topcash", "toppara", "topmoney"],
        name: "topcoin",
        help: "Toplam Coin Miktarını Gösterir",
        category: "ekonomi",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;

        const coins = [];
        const users = message.guild.members.cache.filter((member) => !member.user.bot);

        for (const [id, member] of users) {
            const coin = db.fetch(`coin_${id}`);
            if (coin) {
                coins.push({ user: member.user.tag, coin });
            }
        }

        const topCoins = coins.sort((a, b) => b.coin - a.coin).slice(0, 20);

        const canvas = Canvas.createCanvas(700, 500);
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#2F3136";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = "bold 50px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Top 20 Coin", 50, 75);

        for (let i = 0; i < topCoins.length; i++) {
            const coin = topCoins[i];
            const x = 50;
            const y = 150 + 50 * i;
            const cardWidth = 600;
            const cardHeight = 40;

            ctx.fillStyle = i % 2 === 0 ? "#7289DA" : "#5865F2";
            ctx.fillRect(x, y, cardWidth, cardHeight);

            ctx.font = "bold 25px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(`${i + 1}.`, x + 10, y + 30);

            ctx.font = "bold 25px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "left";
            ctx.fillText(coin.user, x + 60, y + 30);

            ctx.font = "bold 25px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "left";
            ctx.fillText(`${coin.coin} Coin`, x + cardWidth - 150, y + 30);
        }

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "topcoin.png" });

        const topembed = new EmbedBuilder()
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
            .setColor("White")
            .setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
            .setTimestamp()
            .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
            .setTitle(`Top 20 Coin`)
            .setImage(`attachment://topcoin.png`)

        message.reply({
            embeds: [topembed], files: [attachment]
        });
    },
};