const db = require("nrc.db");
const settings = require("../../configs/settings.json");
const { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unjail")
        .setDescription("Etiketlenen Kişinin Jail'ini Kaldırır")
        .addUserOption(option => option
            .setName("kullanıcı")
            .setDescription("Jaili kaldırılacak kullanıcıyı etiketleyin.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("sebep")
            .setDescription("Jail kaldırma sebebini girin.")
            .setRequired(false)),
    async execute(interaction, client, embed) {
        const jailRole = db.get(`jail_rol_${interaction.guild.id}`);
        const logChannel = db.get(`jail_kanal_${interaction.guild.id}`);
        const jailYtkRole = db.get(`jail_yetkilirol_${interaction.guild.id}`);

        if (!jailRole)
            return interaction.reply({
                content: `Jail rolü ayarlanmamış. Ayarlamak için \`${settings.prefix}jail-ayar rol @Rol\``,
                ephemeral: true
            });

        if (!logChannel)
            return interaction.reply({
                content: `Jail log ayarlanmamış. Ayarlamak için \`${settings.prefix}jail-ayar log #Kanal\``,
                ephemeral: true
            });

        if (!jailYtkRole && !interaction.member.permissions.has("ADMINISTRATOR"))
            return interaction.reply({
                content: `Bu komudu sadece ayarlanan **Jail yetkilisi** veya sunucuyu yönet yetkisine sahip olan kişiler kullanabilir`,
                ephemeral: true
            });

        const user = interaction.options.getUser("kullanıcı");
        const unjailReason = interaction.options.getString("sebep") || "Belirtilmedi";

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

        if (!member.roles.cache.has(jailRole))
            return interaction.reply({
                content: "Bu kullanıcı zaten jailde değil.",
                ephemeral: true
            });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("unjail_onay")
                    .setLabel("Onayla")
                    .setStyle(ButtonBuilder.Success),
                new ButtonBuilder()
                    .setCustomId("unjail_iptal")
                    .setLabel("İptal")
                    .setStyle(ButtonBuilder.Danger)
            );

        await interaction.reply({
            embeds: [embed.setDescription(`**${user.tag}** adlı kullanıcının jaili kaldırmak istediğinize emin misiniz. Sebep: **${unjailReason}**`)],
            components: [row],
            ephemeral: false
        });

        const filter = i => i.customId === "unjail_onay" || i.customId === "unjail_iptal";
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on("collect", async i => {
            if (i.customId === "unjail_onay") {
                try {
                    await member.roles.remove(jailRole);

                    const logChannelSend = await interaction.guild.channels.cache.get(logChannel).send({ embeds: [embed.setDescription(`**${user.tag}** adlı kullanıcının jaili **${interaction.user.tag}** tarafından kaldırıldı. Sebep: **${unjailReason}**`)] });

                    await interaction.editReply({
                        embeds: [embed.setDescription(`Jail kaldırma işlemi başarılı bir şekilde gerçekleşti. ${logChannelSend.url}`)],
                        components: []
                    });
                } catch (error) {
                    return interaction.editReply({
                        content: "Bir hata oluştu, lütfen daha sonra tekrar deneyin.",
                        components: []
                    });
                }
            } else if (i.customId === "unjail_iptal") {
                interaction.editReply({
                    content: "Jail kaldırma işlemi iptal edildi.",
                    components: []
                });
            }
        });
    },
};