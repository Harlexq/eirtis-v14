const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ses')
        .setDescription('Etiketlediğiniz Ses Kanalına Botu Sokar')
        .addSubcommand(subcommand =>
            subcommand.setName('ekle')
                .setDescription('Belirtilen ses kanalına botu ekler')
                .addChannelOption(option =>
                    option.setName('kanal')
                        .setDescription('Botun bağlanacağı ses kanalı')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('çıkar')
                .setDescription('Botu bağlı olduğu ses kanalından çıkarır')
        ),
    async execute(interaction, client, embed) {
        const voiceChannel = interaction.member.voice.channel;
        const subCommand = interaction.options.getSubcommand();

        if (subCommand === 'ekle') {
            const targetVoiceChannel = interaction.options.getChannel('kanal') || voiceChannel;

            if (!targetVoiceChannel) {
                return interaction.reply('Geçerli bir ses kanalı bulunamadı.');
            }

            try {
                const connection = getVoiceConnection(interaction.guild.id);
                if (connection) await connection.destroy();
                const voiceConnection = await joinVoiceChannel({
                    channelId: targetVoiceChannel.id,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                });
                interaction.reply(`Bot, ${targetVoiceChannel} kanalına başarıyla bağlandı!`);
            } catch (error) {
                interaction.reply(`Bir hata oluştu: ${error.message}`);
            }
        } else if (subCommand === 'çıkar') {
            try {
                const connection = getVoiceConnection(interaction.guild.id);
                if (connection) {
                    await connection.destroy();
                    interaction.reply('Bot, kanaldan ayrıldı!');
                } else {
                    interaction.reply('Bot zaten bir ses kanalında değil!');
                }
            } catch (error) {
                interaction.reply(`Bir hata oluştu: ${error.message}`);
            }
        }
    },
};
