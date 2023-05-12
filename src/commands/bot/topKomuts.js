const { EmbedBuilder } = require("discord.js");

module.exports = {
    conf: {
        aliases: ["komutlar", "top-komuts", "topkomuts"],
        name: "topkomut",
        help: "Botda Bulunan Toplam Komutl Sayısını Gösterir",
        category: "bot",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;

        const categories = {};

        client.commands.forEach(command => {
            if (!categories[command.conf.category]) categories[command.conf.category] = 0;
            categories[command.conf.category]++;
        });

        const embed = new EmbedBuilder()
            .setColor("White")
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
            .setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
            .setTimestamp()
            .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
            .setDescription(`
            **Eirtis'te Bulunan Toplam Komut Sayısı:** ${client.commands.size}
      `);

        for (const [category, count] of Object.entries(categories)) {
            const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
            embed.addFields({ name: `${formattedCategory} Komutları`, value: `${count || '0'}`, inline: true })
        }

        if (!args[0]) return message.reply({ embeds: [embed] });
    },
}