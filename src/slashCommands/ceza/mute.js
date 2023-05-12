const db = require("nrc.db")
const settings = require("../../configs/settings.json")
const { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Etiketlenen Kişiye Chat Mute Atar")
        .addUserOption(option => option
            .setName("kullanıcı")
            .setDescription("Mute atılacak kullanıcıyı etiketleyin.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("sebep")
            .setDescription("Mute sebebini girin.")
            .setRequired(false)),
    async execute(interaction, client, embed) {
        const mutedRole = db.get(`mute_rol_${interaction.guild.id}`);
        const logChannel = db.get(`mute_kanal_${interaction.guild.id}`);
        const muteYtkRole = db.get(`mute_yetkilirol_${interaction.guild.id}`);

        if (!mutedRole)
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
                content: `Bu komudu sadece ayarlanan **mute yetkilisi** veya sunucuyu yönet yetkisine sahip olan kişiler kullanabilir`,
                ephemeral: true
            });

        const user = interaction.options.getUser("kullanıcı");
        const muteReason = interaction.options.getString("sebep") || "Belirtilmedi";

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

        if (member.roles.cache.has(mutedRole))
            return interaction.reply({
                content: "Bu kullanıcı zaten muteli.",
                ephemeral: true
            });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("mute_onay")
                    .setLabel("Onayla")
                    .setStyle(ButtonBuilder.Success),
                new ButtonBuilder()
                    .setCustomId("mute_iptal")
                    .setLabel("İptal")
                    .setStyle(ButtonBuilder.Danger)
            );

        interaction.reply({
            embeds: [embed.setDescription(`**${user.tag}** adlı kullanıcıya **${interaction.user.tag}** tarafından mute atıldı. Sebep: **${muteReason}**`)],
            components: [row],
            ephemeral: true
        }).then(async (msg) => {
            const filter = i => i.customId === "mute_onay" || i.customId === "mute_iptal";
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on("collect", async i => {
                if (i.customId === "mute_onay") {
                    await member.roles.add(mutedRole, `Mute sebebi: ${muteReason}`);

                    const logChannelObj = await interaction.guild.channels.cache.get(logChannel);
                    if (logChannelObj) logChannelObj.send({ embeds: [embed.setDescription(`**${user.tag}** adlı kullanıcıya **${interaction.user.tag}** tarafından mute atıldı. Sebep: **${muteReason}**`)] });

                    interaction.editReply({
                        embeds: [muteEmbed.setDescription(`**${user.tag}** adlı kullanıcı **${interaction.user.tag}** tarafından mutelendi.`)],
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