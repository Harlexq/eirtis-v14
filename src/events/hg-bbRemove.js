const db = require("nrc.db");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const Canvas = require("canvas");

module.exports = async (member) => {
    let hgbb = db.fetch(`hg_bb_kanal_${member.guild.id}`);
    if (!hgbb) return;

    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext("2d");

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: "png" }));

    ctx.fillStyle = "#2c2f33";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 40px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(member.user.username, 250, 70);

    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'welcome-image.png' });

    const hg = new EmbedBuilder()
        .setDescription(`${member}, Aramızdan Ayrıldı`)
        .setColor("White")
        .setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true, size: 2048 }) })
        .setImage("attachment://welcome-image.png")
        .setTimestamp()
        .setFooter({ text: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true, size: 2048 }) })

    member.client.channels.cache.get(hgbb).send({ content: `${member}, Aramızdan Ayrıldı`, embeds: [hg], files: [attachment] });
};

module.exports.conf = {
    name: "guildMemberRemove",
};
