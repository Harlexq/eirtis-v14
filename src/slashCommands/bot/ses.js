const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const db = require("nrc.db");

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

        const rows = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Premium Üye Ol")
                    .setURL("https://discord.com/users/801069133810237491")
            );

        const premiumUserID = "801069133810237491";

        if (interaction.user.id !== premiumUserID && !db.get(`premium_${interaction.user.id}`)) {
            return interaction.reply({ content: "Bu komutu sadece premium üyeler kullanabilir sende premium üye olmak istersen aşağıdaki butona basarak iletişime geçebilirsin", components: [rows] });
        }

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

                db.set(`voiceConnection_${interaction.guild.id}`, {
                    channelId: voiceConnection.joinConfig.channelId,
                    guildId: voiceConnection.joinConfig.guildId,
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
                    db.delete(`voiceConnection_${interaction.guild.id}`);
                    interaction.reply('Bot, kanaldan ayrıldı!');
                } else {
                    interaction.reply('Bot zaten bir ses kanalında değil!');
                }
            } catch (error) {
                interaction.reply(`Bir hata oluştu: ${error.message}`);
            }
        }

        client.once('ready', () => {

        });


    },
};
