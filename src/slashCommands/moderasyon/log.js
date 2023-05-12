const { SlashCommandBuilder } = require('discord.js');
const db = require("nrc.db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log')
        .setDescription('Sunucuda Olup Bitenleri Kanalda Gösterir')
        .addSubcommand(subcommand =>
            subcommand
                .setName('ayarla')
                .setDescription('Log kanalını ayarlar.')
                .addChannelOption(option =>
                    option.setName('kanal')
                        .setDescription('Log kanalını belirlemek için kanalı etiketleyin.')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('sıfırla')
                .setDescription('Log kanalını sıfırlar.')
        ),
    async execute(interaction, client, embed) {
        const subCommand = interaction.options.getSubcommand();

        if (subCommand === "sıfırla") {
            if (!db.has(`logChannel_${interaction.guild.id}`)) {
                return interaction.reply({ content: `Log kanalı zaten sıfırlanmış.` });
            }

            db.get(`logChannel_${interaction.guild.id}`);
            db.delete(`logChannel_${interaction.guild.id}`);
            return interaction.reply({ content: `Log kanalı sıfırlandı.` });
        }

        const channel = interaction.options.getChannel('kanal');
        if (!channel) {
            return interaction.reply({ content: `Bir kanal etiketleyin veya kanal ID'si girin. \nDoğru kullanım: \`/log ayarla #Kanal\``, ephemeral: true });
        }

        db.set(`logChannel_${interaction.guild.id}`, channel.id);
        interaction.reply({ content: `Log kanalı başarıyla ${channel} olarak ayarlandı.` });
    },
};
