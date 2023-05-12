const db = require("nrc.db");
const settings = require("../../configs/settings.json");
const { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Etiketlenen Kişinin Chat Mute'sini Kaldırır")
        .addUserOption(option => option
            .setName("kullanıcı")
            .setDescription("Mutesi kaldırılacak kullanıcıyı etiketleyin.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("sebep")
            .setDescription("Mute kaldırma sebebini girin.")
            .setRequired(false)),
    async execute(interaction, client, embed) {
        const muteRole = db.get(`mute_rol_${interaction.guild.id}`);
        const logChannel = db.get(`mute_kanal_${interaction.guild.id}`);
        const muteYtkRole = db.get(`mute_yetkilirol_${interaction.guild.id}`);

        if (!muteRole)
            return interaction.reply({
                content: `Mute rolü ayarlanmamış. Ayarlamak için \`${settings.prefix}mute-ayar rol @Rol\``,
                ephemeral: true
            });

        if (!logChannel)
            return interaction.reply({
                content: `Mute log ayarlanmamış. Ayarlamak için \`${settings.prefix}mute-ayar log #Kanal\``,
                ephemeral: true
            });

        if (!muteYtkRole && !interaction.member.permissions.has("ADMINISTRATOR"))
            return interaction.reply({
                content: `Bu komudu sadece ayarlanan **Mute yetkilisi** veya sunucuyu yönet yetkisine sahip olan kişiler kullanabilir`,
                ephemeral: true
            });

        const user = interaction.options.getUser("kullanıcı");
        const unmuteReason = interaction.options.getString("sebep") || "Belirtilmedi";

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

        if (!member.roles.cache.has(muteRole))
            return interaction.reply({
                content: "Bu kullanıcı zaten muteli değil.",
                ephemeral: true
            });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("unmute_onay")
                    .setLabel("Onayla")
                    .setStyle(ButtonBuilder.Success),
                new ButtonBuilder()
                    .setCustomId("unmute_iptal")
                    .setLabel("İptal")
                    .setStyle(ButtonBuilder.Danger)
            );

        await interaction.reply({
            embeds: [embed.setDescription(`**${user.tag}** adlı kullanıcının mutesi kaldırmak istediğinize emin misiniz. Sebep: **${unmuteReason}**`)],
            components: [row],
            ephemeral: false
        });

        const filter = i => i.customId === "unmute_onay" || i.customId === "unmute_iptal";
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on("collect", async i => {
            if (i.customId === "unmute_onay") {
                try {
                    await member.roles.remove(muteRole);

                    const logChannelSend = await interaction.guild.channels.cache.get(logChannel).send({ embeds: [embed.setDescription(`**${user.tag}** adlı kullanıcının mutesi **${interaction.user.tag}** tarafından kaldırıldı. Sebep: **${unmuteReason}**`)] });

                    await interaction.editReply({
                        embeds: [embed.setDescription(`Mute kaldırma işlemi başarılı bir şekilde gerçekleşti. ${logChannelSend.url}`)],
                        components: []
                    });
                } catch (error) {
                    return interaction.editReply({
                        content: "Bir hata oluştu, lütfen daha sonra tekrar deneyin.",
                        components: []
                    });
                }
            } else if (i.customId === "unmute_iptal") {
                interaction.editReply({
                    content: "Mute kaldırma işlemi iptal edildi.",
                    components: []
                });
            }
        });
    },
};