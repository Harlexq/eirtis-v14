const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
    conf: {
        aliases: ["herkese-rol-ver"],
        name: "herkeserolver",
        help: "Sunucudaki Herkese Etiketlediğiniz Rolü Verir",
        category: "moderasyon",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply({ content: `Yetkin bulunmamakta dostum.`, ephemeral: true });
        }

        const role = message.mentions.roles.first();
        if (!role) {
            return message.reply({ content: `Lütfen bir rol etiketleyin.`, ephemeral: true });
        }

        const members = message.guild.members.cache.filter(member => !member.user.bot);

        const embed = new EmbedBuilder()
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
            .setColor("White")
            .setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
            .setTimestamp()
            .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
            .setTitle('Herkeserolver Komutu')
            .setDescription(`<@&${role.id}> rolü sunucudaki herkese veriliyor...`)
            .addFields({ name: 'Toplam Kullanıcı Sayısı:', value: `${members.size}` })
            .addFields({ name: 'Rol Bilgileri:', value: `Rol ID: ${role.id}\nRol Adı: ${role.name}\nRol Etiketi: <@&${role.id}>` });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('cancel_button')
                    .setLabel('İptal')
                    .setStyle(ButtonStyle.Danger)
            );

        let msg = await message.reply({ embeds: [embed], components: [row] });

        const filter = (i) => i.customId === 'cancel_button' && i.user.id === message.user.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', (i) => {
            embed.setDescription('Rol herkese verme işlemi kullanıcı tarafından iptal edildi.');
            msg.edit({ embeds: [embed], components: [] });
            collector.stop();
        });

        try {
            await Promise.all(members.map(member => member.roles.add(role)));
            embed.setDescription(`<@&${role.id}> rolü başarıyla sunucudaki herkese verildi.`);
            msg.edit({ embeds: [embed], components: [] });
        } catch (error) {
            embed.setDescription(`Bir hata oluştu: ${error.message}`);
            msg.edit({ embeds: [embed], components: [] });
        }
    },
};