const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");
const settings = require("../../configs/settings.json");

module.exports = async (guild) => {

    const button1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel('Destek Sunucum')
                .setEmoji("1086621220235133049")
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.gg/KXNebFVhTU'),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel('Davet Et')
                .setEmoji("1086621220235133049")
                .setURL('https://discord.com/api/oauth2/authorize?client_id=1099740758623395860&permissions=8&scope=bot%20applications.commands')
        );

    const owner = await guild.fetchOwner();
    const ownerDM = new EmbedBuilder()
        .setAuthor({ name: owner.user.username, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
        .setFooter({ text: "Eirtis", iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
        .setThumbnail("https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png")
        .setDescription(`
    <a:harlexkelebekler:1017145722749059164> ${owner}, **${guild.name}** Adlı Sunucudan Çıkartıldım Beni Tekrardan Sunucuya Eklemek İçin Aşağıdaki Butonu Kullanabilirsin

    <a:harlexyesilkalp:1076187937869402162> **Benim Slashlı Komutlarım Ve Prefixli Komutlarım Var**

    <a:harlexpembekalp:1028811867692486656> **Prefixim** = **${settings.prefix}** Ve **/**

    <a:harlexmavikalp:1028811864978751529> **e.yardım** Yazarak Komutlarıma Ulaşabilirsiniz
    `)
        .setColor("White")
    try {
        await owner.send({ content: `**${owner}**, Merhaba Dostum Benim Adım **Eirtis**`, embeds: [ownerDM], components: [button1] });
    } catch (error) {
    }
};

module.exports.conf = {
    name: "guildDelete",
};
