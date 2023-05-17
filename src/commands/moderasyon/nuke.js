const { PermissionsBitField } = require('discord.js');

module.exports = {
    conf: {
        aliases: ["nuke"],
        name: "nuke",
        help: "Etiketlediğiniz Kanalı Sıfırlar",
        category: "moderasyon",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;

        const targetChannel = message.mentions.channels.first() || await message.guild.channels.cache.get(args[0]);

        if (!targetChannel) return message.reply("Lütfen bir kanal etiketleyin veya ID'sini girin.");

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply("Bu komudu kullanabilmek için `Yönetici` iznine sahip olmanız gerekiyor.");

        if (targetChannel.deleted || targetChannel.type === "GUILD_CATEGORY") {
            return message.reply("Belirtilen kanal mevcut değil veya kategori türünde olduğundan silinemez.");
        }

        if (targetChannel.type === "GUILD_COMMUNITY") {
            return message.reply("Belirtilen kanal bir topluluk kanalı olduğundan silinemez.");
        }

        const delay = ms => new Promise(res => setTimeout(res, ms));
        await message.reply(`Kanal ${targetChannel} sıfırlanıyor...`);
        await delay(5000);

        const position = targetChannel.position;
        try {
            await targetChannel.delete();
        } catch (error) {
            if (error.code === 50074) {
                return message.reply("Bu kanal topluluk sunucusu için gereklidir ve silinemez.");
            }
        }

        const channel = await targetChannel.clone({
            reason: "Kanal sıfırlandı."
        });

        await channel.setPosition(position);
        await delay(3000);
    },

}