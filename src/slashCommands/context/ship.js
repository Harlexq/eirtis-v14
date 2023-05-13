const { ContextMenuCommandBuilder, ApplicationCommandType, AttachmentBuilder } = require("discord.js");
const Canvas = require("canvas");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Ship")
        .setType(ApplicationCommandType.User),

    async execute(interaction, client, embed) {

        const user = interaction.options.getUser("user");
        await user.fetch();

        if (user.bot || user.id === interaction.user.id) {
            return interaction.reply("Kendiniz veya bir bot ile eşleşemezsiniz.");
        }

        const percentage = Math.floor(Math.random() * 101);

        const backgroundImages = [
            "https://media.discordapp.net/attachments/1088770525255442543/1099364679836500048/kirmizi.jpg",
            "https://media.discordapp.net/attachments/1088770525255442543/1099364680226582540/yesilkrmz.jpg",
            "https://cdn.discordapp.com/attachments/1088770525255442543/1099364680771833856/mavikrmz.jpg",
            "https://media.discordapp.net/attachments/1088770525255442543/1099364681807822888/siyakrmz.jpg"
        ];

        const randomBackgroundImage =
            backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

        const avatar1 = await Canvas.loadImage(
            interaction.user.displayAvatarURL({ extension: "png" })
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
            `**<@${interaction.user.id}>** ve **<@${user.id}>** arasındaki aşk **%${percentage}** ${percentage >= 50 ? "💖" : "💔"
            }`,
            `**<@${interaction.user.id}>** ve **<@${user.id}>** arasında **%${percentage}** aşk var, ne romantik! ${percentage >= 50 ? "💕" : "💔"
            }`,
            `**<@${interaction.user.id}>** ve **<@${user.id}>** bir birbirlerine %${percentage} oranında aşıklar ${percentage >= 50 ? "❤️" : "💔"
            }`,
            `<@${interaction.user.id}> ve <@${user.id}> arasındaki aşk ölçer %${percentage} gösteriyor ${percentage >= 50 ? "💘" : "💔"
            }`,
        ];

        const randomLoveMessage =
            loveMessages[Math.floor(Math.random() * loveMessages.length)];

        const buffer = canvas.toBuffer();
        const attachment = new AttachmentBuilder(buffer, { name: "ship.png" });

        interaction.channel.send({
            embeds: [embed.setDescription(randomLoveMessage)
                .setImage("attachment://ship.png")], files: [attachment]
        });
    }
};