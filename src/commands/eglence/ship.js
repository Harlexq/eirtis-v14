const { AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Canvas = require("canvas");

module.exports = {
    conf: {
        aliases: ["ship"],
        name: "ship",
        help: "Sunucudaki Kullanıcıyla Shipler",
        category: "eglence",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;

        let user = message.mentions.users.first();
        if (!user) {
            const members = message.guild.members.cache.filter(
                (member) => member.id !== message.author.id && !member.user.bot
            );
            user = members.random().user;
        }

        if (user.bot || user.id === message.author.id) {
            return message.reply("kendiniz veya bir bot ile eşleşemezsiniz.");
        }

        const percentage = Math.floor(Math.random() * 101);

        const backgroundImages = [
            "https://media.discordapp.net/attachments/1088770525255442543/1099364679836500048/kirmizi.jpg",
            "https://media.discordapp.net/attachments/1088770525255442543/1099364680226582540/yesilkrmz.jpg",
            "https://cdn.discordapp.com/attachments/1088770525255442543/1099364680771833856/mavikrmz.jpg",
            "https://media.discordapp.net/attachments/1088770525255442543/1099364681807822888/siyakrmz.jpg"
        ];

        const randomBackgroundImage = backgroundImages[
            Math.floor(Math.random() * backgroundImages.length)
        ];

        const avatar1 = await Canvas.loadImage(
            message.author.displayAvatarURL({ extension: "png" })
        );
        const avatar2 = await Canvas.loadImage(
            user.displayAvatarURL({ extension: "png" })
        );
        const canvas = Canvas.createCanvas(700, 300);
        const ctx = canvas.getContext("2d");

        const backgroundImage = await Canvas.loadImage(randomBackgroundImage);
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        const avatarSize = 150;
        ctx.drawImage(avatar1, 50, 70, avatarSize, avatarSize);
        ctx.drawImage(avatar2, 500, 70, avatarSize, avatarSize);

        ctx.font = "bold 35px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`${percentage}%`, 295, 175);

        const loveMessages = [
            `**${message.author}** ve **${user}** arasındaki aşk **%${percentage}** ${percentage >= 50 ? "💖" : "💔"}`,
            `**${message.author}** ve **${user}** arasında **%${percentage}** aşk var, ne romantik! ${percentage >= 50 ? "💕" : "💔"}`,
            `**${message.author}** ve **${user}** birbirlerine **%${percentage}** aşık olmuşlar! ${percentage >= 50 ? "💘" : "💔"}`,
            `Bugün **${message.author}** ve **${user}** arasındaki aşk **%${percentage}** Yarın ne olacağına bakalım... ${percentage >= 50 ? "😍" : "😢"}`,
        ];

        let shipbtn = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel(`Tanış`)
                    .setEmoji("1028811861669445682")
                    .setURL(`https://discord.com/users/${user.id}`)
            );

        const randomLoveMessage = loveMessages[Math.floor(Math.random() * loveMessages.length)];

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "ship.png" });

        const shipembed = new EmbedBuilder()
            .setDescription(randomLoveMessage)
            .setImage("attachment://ship.png")
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
            .setColor("White")
            .setTimestamp()
            .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })

        message.reply({
            embeds: [shipembed], files: [attachment], components: [shipbtn]
        })
    },
};