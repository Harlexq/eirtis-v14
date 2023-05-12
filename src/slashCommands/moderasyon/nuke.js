const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Etiketlediğiniz Kanalı Sıfırlar')
        .addChannelOption(option => option
            .setName('kanal')
            .setDescription('Nuke işleminin uygulanacağı kanalı etiketleyin.')
            .setRequired(true)),
    async execute(interaction, client, embed) {
        const targetChannel = interaction.options.getChannel('kanal');

        if (!targetChannel) return interaction.reply("Lütfen bir kanal etiketleyin.");

        if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("Bu komudu kullanabilmek için `Yönetici` iznine sahip olmanız gerekiyor.");

        if (targetChannel.deleted || targetChannel.type === "GUILD_CATEGORY") {
            return interaction.reply("Belirtilen kanal mevcut değil veya kategori türünde olduğundan silinemez.");
        }

        const delay = ms => new Promise(res => setTimeout(res, ms));
        await interaction.reply(`${targetChannel} Kanalı sıfırlanıyor...`);
        await delay(5000);

        const position = targetChannel.position;
        try {
            await targetChannel.delete();
        } catch (error) {
            if (error.code === 50074) {
                return interaction.channel.send({ content: "Bu kanal topluluk sunucusu için gereklidir ve silinemez.", ephemeral: true });
            }
        }

        const channel = await targetChannel.clone({
            reason: "Kanal sıfırlandı."
        });

        await channel.setPosition(position);
        await delay(3000);
        await interaction.editReply(`Kanal ${targetChannel} sıfırlandı.`);
    },
};