const { AttachmentBuilder, StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const Canvas = require("canvas")
const moment = require("moment");
require("moment-duration-format");
const db = require("nrc.db")

module.exports = {
    conf: {
        aliases: ["dolar", "cash", "para", "money"],
        name: "coin",
        help: "Etiketlenen Kullanıcının Veya Sizin Coininizi Gösterir",
        category: "ekonomi",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;

        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if (!target) return message.reply(`Kullanıcı bulunamadı!`);
        let account = db.fetch(`hesap_${target.id}`);
        if (!account) return message.reply(`Kullanıcının hesabı yok. Lütfen önce bir hesap oluşturun. \`e.hesap kur [isim]\``);

        let coin = db.fetch(`coin_${target.id}`);

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('row')
                    .setPlaceholder('Toplam Coin Miktarını Hakkında Yardım Almak İçin Tıkla')
                    .addOptions([
                        {
                            label: 'Top Coin',
                            value: 'topcoin',
                            description: "Toplam Coin Miktarını Gösterir",
                            emoji: '1086619027432026162',
                        }
                    ]),
            );

        const applyText = (canvas, text) => {
            const ctx = canvas.getContext('2d');

            let fontSize = 70;

            do {
                ctx.font = `${fontSize -= 10}px sans-serif`;
            } while (ctx.measureText(text).width > canvas.width - 300);

            return ctx.font;
        };

        const canvas = Canvas.createCanvas(700, 240);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage('https://cdn.discordapp.com/attachments/1088770525255442543/1097928023174565949/cash2.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        const member = target;

        const username = target.user.username || target.nickname || target.user.tag;
        const yazı = []
        if (username.length > 12) {
            let yarrak = username.slice(0, 12)
            yazı.push(`${yarrak}..`)
        } else {
            yazı.push(`${username}`)
        }

        ctx.font = '20px "Marlin Geo Black"';
        ctx.fillStyle = '#000000';
        ctx.fillText(`${coin ? coin : "0"} Coin`, canvas.width / 2.40, canvas.height / 1.28);

        ctx.font = '30px "Marlin Geo Black"',
            ctx.fillStyle = '#000000';
        ctx.fillText(`${yazı}`, canvas.width / 2.35, canvas.height / 1.12);

        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'png' }));
        ctx.save();
        roundedImage(ctx, 449, 125, 105, 105, 10);
        ctx.clip();
        ctx.drawImage(avatar, 449, 125, 105, 105);
        ctx.closePath();

        ctx.clip();

        function roundedImage(ctx, x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.clip();
        }

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'harlex.png' });

        const coinembed = new EmbedBuilder()
            .setImage(`attachment://harlex.png`)
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
            .setColor("White")
            .setTimestamp()
            .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })

        let msg = await message.reply({ embeds: [coinembed], content: `${member}'in Coin Bilgisi`, files: [attachment], components: [row] })

        var filter = (interaction) => interaction.user.id === message.author.id;
        let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })

        collector.on("collect", async (interaction) => {
            if (interaction.values[0] === "topcoin") {

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

                const topcoinembed = new EmbedBuilder()
                    .setTitle(`Top 20 Coin`)
                    .setImage(`attachment://topcoin.png`)
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
                    .setColor("White")
                    .setTimestamp()
                    .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })

                interaction.reply({
                    embeds: [topcoinembed], files: [attachment], ephemeral: true
                });
            }
        })
    },
}
