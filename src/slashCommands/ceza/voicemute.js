const db = require("nrc.db")
const settings = require("../../configs/settings.json")
const { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("voicemute")
        .setDescription("Etiketlenen Kişiye Voice Mute Atar")
        .addUserOption(option => option
            .setName("kullanıcı")
            .setDescription("Voice Mute atılacak kullanıcıyı etiketleyin.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("sebep")
            .setDescription("Voice Mute sebebini girin.")
            .setRequired(false)),
    async execute(interaction, client, embed) {
        const voicemutedRole = db.get(`voicemute_rol_${interaction.guild.id}`);
        const logChannel = db.get(`voicemute_kanal_${interaction.guild.id}`);
        const voicemuteYtkRole = db.get(`voicemute_yetkilirol_${interaction.guild.id}`);

        if (!voicemutedRole)
            return interaction.reply({
                content: `Voice Mute rolü ayarlanmamış. Ayarlamak için \`${settings.prefix}voicemute-ayar rol @Rol\``,
                ephemeral: true
            });

        if (!logChannel)
            return interaction.reply({
                content: `Voice Mute log ayarlanmamış. Ayarlamak için \`${settings.prefix}voicemute-ayar log #Kanal\``,
                ephemeral: true
            });

        if (!voicemuteYtkRole && !interaction.member.permissions.has("ADMINISTRATOR"))
            return interaction.reply({
                content: `Bu komudu sadece ayarlanan **Voice Mute Yetkilisi** veya sunucuyu yönet yetkisine sahip olan kişiler kullanabilir`,
                ephemeral: true
            });

        const user = interaction.options.getUser("kullanıcı");
        const voicemuteReason = interaction.options.getString("sebep") || "Belirtilmedi";

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

        if (member.roles.cache.has(voicemutedRole))
            return interaction.reply({
                content: "Bu kullanıcı zaten voice muteli.",
                ephemeral: true
            });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("voicemute_onay")
                    .setLabel("Onayla")
                    .setStyle(ButtonBuilder.Success),
                new ButtonBuilder()
                    .setCustomId("voicemute_iptal")
                    .setLabel("İptal")
                    .setStyle(ButtonBuilder.Danger)
            );

        interaction.reply({
            embeds: [embed.setDescription(`**${user.tag}** adlı kullanıcıya **${interaction.user.tag}** tarafından voice mute atıldı. Sebep: **${voicemuteReason}**`)],
            components: [row],
            ephemeral: true
        }).then(async (msg) => {
            const filter = i => i.customId === "voicemute_onay" || i.customId === "voicemute_iptal";
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on("collect", async i => {
                if (i.customId === "voicemute_onay") {
                    await member.roles.add(voicemutedRole, `Jail Mute sebebi: ${voicemuteReason}`);
                    ;

                    const logChannelObj = await interaction.guild.channels.cache.get(logChannel);
                    if (logChannelObj) logChannelObj.send({ embeds: [embed.setDescription(`**${user.tag}** adlı kullanıcıya **${interaction.user.tag}** tarafından voice mute atıldı. Sebep: **${voicemuteReason}**`)] });

                    interaction.editReply({
                        embeds: [voicemuteEmbed.setDescription(`**${user.tag}** adlı kullanıcı **${interaction.user.tag}** tarafından voice mutelendi.`)],
                        components: []
                    });
                } else {
                    interaction.editReply({ content: "İşlem iptal edildi.", components: [] });
                }
            });

            collector.on("end", async () => {
                if (!interaction.replied) return;
                await interaction.editReply({ components: [] });
            });
        })
    }
}