const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = async (message) => {
    if (message.author.bot) return;

    const button1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel('Destek Sunucusu')
                .setEmoji("1086621220235133049")
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.gg/KXNebFVhTU'),
            new ButtonBuilder()
                .setLabel("Davet Et")
                .setStyle(ButtonStyle.Link)
                .setEmoji("1086621220235133049")
                .setURL('https://discord.com/api/oauth2/authorize?client_id=1099740758623395860&permissions=8&scope=bot%20applications.commands')
        );

    const botMention = message.mentions.members?.find(member => member.user.id === client.user.id);
    if (botMention && message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) {
        message.reply({ content: `Merhaba! Nasıl Yardımcı Olabilirim **e.yardım** Yazarak Komutlarıma Ulaşabilirsiniz`, components: [button1] });
    }
}

module.exports.conf = {
    name: "messageCreate",
};
