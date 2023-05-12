const db = require("nrc.db");
const settings = require("../../configs/settings.json");
const { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unvoicemute")
        .setDescription("Etiketlenen Kişinin Voice Mute'sini Kaldırır")
        .addUserOption(option => option
            .setName("kullanıcı")
            .setDescription("Voice Mutesi kaldırılacak kullanıcıyı etiketleyin.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("sebep")
            .setDescription("Voice Mute kaldırma sebebini girin.")
            .setRequired(false)),
    async execute(interaction, client, embed) {
        const voicemuteRole = db.get(`voicemute_rol_${interaction.guild.id}`);
        const logChannel = db.get(`voicemute_kanal_${interaction.guild.id}`);
        const voicemuteYtkRole = db.get(`voicemute_yetkilirol_${interaction.guild.id}`);

        if (!voicemuteRole)
            return interaction.reply({
                content: `Voice Mute rolü ayarlanmamış. Ayarlamak için \`${settings.prefix}voicemute-ayar rol @Rol\``,
                ephemeral: true
            });

        if (!logChannel)
            return interaction.reply({
                content: `MVoice Muteute log ayarlanmamış. Ayarlamak için \`${settings.prefix}voicemute-ayar log #Kanal\``,
                ephemeral: true
            });

        if (!voicemuteYtkRole && !interaction.member.permissions.has("ADMINISTRATOR"))
            return interaction.reply({
                content: `Bu komudu sadece ayarlanan **Voice Mute yetkilisi** veya sunucuyu yönet yetkisine sahip olan kişiler kullanabilir`,
                ephemeral: true
            });

        const user = interaction.options.getUser("kullanıcı");
        const unvoicemuteReason = interaction.options.getString("sebep") || "Belirtilmedi";

        if (!user)
            return interaction.reply({
                content: "Lütfen bir kişi etiketleyiniz.",
                ephemeral: true
            });

        const member = await interaction.guild.members.fetch(user.id);
        if (!member)
            return interaction.reply({
                content: "Belirtilen kullanıcı sunucuda bulunamadı.",
                ephemeral: true
            });

        if (!member.roles.cache.has(voicemuteRole))
            return interaction.reply({
                content: "Bu kullanıcı zaten voice muteli değil.",
                ephemeral: true
            });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("unvoicemute_onay")
                    .setLabel("Onayla")
                    .setStyle(ButtonBuilder.Success),
                new ButtonBuilder()
                    .setCustomId("unvoicemute_iptal")
                    .setLabel("İptal")
                    .setStyle(ButtonBuilder.Danger)
            );

        await interaction.reply({
            embeds: [embed.setDescription(`**${user.tag}** adlı kullanıcının voice mutesini kaldırmak istediğinize emin misiniz. Sebep: **${unvoicemuteReason}**`)],
            components: [row],
            ephemeral: false
        });

        const filter = i => i.customId === "unvoicemute_onay" || i.customId === "unvoicemute_iptal";
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on("collect", async i => {
            if (i.customId === "unvoicemute_onay") {
                try {
                    await member.roles.remove(voicemuteRole);

                    const logChannelSend = await interaction.guild.channels.cache.get(logChannel).send({ embeds: [embed.setDescription(`**${user.tag}** adlı kullanıcının voice voicemutesi **${interaction.user.tag}** tarafından kaldırıldı. Sebep: **${unvoicemuteReason}**`)] });

                    await interaction.editReply({
                        embeds: [embed.setDescription(`Voice Mute kaldırma işlemi başarılı bir şekilde gerçekleşti. ${logChannelSend.url}`)],
                        components: []
                    });
                } catch (error) {
                    return interaction.editReply({
                        content: "Bir hata oluştu, lütfen daha sonra tekrar deneyin.",
                        components: []
                    });
                }
            } else if (i.customId === "unvoicemute_iptal") {
                interaction.editReply({
                    content: "Voice Mute kaldırma işlemi iptal edildi.",
                    components: []
                });
            }
        });
    },
};