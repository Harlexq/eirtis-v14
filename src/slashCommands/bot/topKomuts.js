const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("topkomut")
        .setDescription("Botda Bulunan Toplam Komutl Sayısını Gösterir"),
    async execute(interaction, client, embed) {

        const categories = {};

        client.commands.forEach(command => {
            if (!categories[command.conf.category]) categories[command.conf.category] = 0;
            categories[command.conf.category]++;
        });

        const embedx = new EmbedBuilder()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true, size: 2048 }) })
            .setColor("White")
            .setThumbnail(interaction.user.avatarURL({ dynamic: true, size: 2048 }))
            .setTimestamp()
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true, size: 2048 }) })
            .setDescription(`
        Eirtis'te Bulunan Toplam Komut Sayısı: **${client.commands.size}**
      `);

        for (const [category, count] of Object.entries(categories)) {
            const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
            embedx.addFields({ name: `${formattedCategory} Komutları`, value: `${count || '0'}`, inline: true });
        }

        interaction.reply({ embeds: [embedx] });

    }
};