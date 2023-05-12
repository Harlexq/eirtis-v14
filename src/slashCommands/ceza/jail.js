const db = require("nrc.db")
const settings = require("../../configs/settings.json")
const { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("jail")
        .setDescription("Etiketlenen Kişiye Jail Atar")
        .addUserOption(option => option
            .setName("kullanıcı")
            .setDescription("Jail atılacak kullanıcıyı etiketleyin.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("sebep")
            .setDescription("Jail sebebini girin.")
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
        const jailReason = interaction.options.getString("sebep") || "Belirtilmedi";

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

        if (member.roles.cache.has(jailRole))
            return interaction.reply({
                content: "Bu kullanıcı zaten jailde.",
                ephemeral: true
            });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("jail_onay")
                    .setLabel("Onayla")
                    .setStyle(ButtonBuilder.Success),
                new ButtonBuilder()
                    .setCustomId("jail_iptal")
                    .setLabel("İptal")
                    .setStyle(ButtonBuilder.Danger)
            );

        interaction.reply({
            embeds: [embed.setDescription(`**${user.tag}** adlı kullanıcıya **${interaction.user.tag}** tarafından jail atıldı. Sebep: **${jailReason}**`)],
            components: [row],
            ephemeral: true
        }).then(async (msg) => {
            const filter = i => i.customId === "jail_onay" || i.customId === "jail_iptal";
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on("collect", async i => {
                if (i.customId === "jail_onay") {
                    await member.roles.add(jailRole, `Jail sebebi: ${jailReason}`);

                    const logChannelObj = await interaction.guild.channels.cache.get(logChannel);
                    if (logChannelObj) logChannelObj.send({ embeds: [emebd.setDescription(`**${user.tag}** adlı kullanıcıya **${interaction.user.tag}** tarafından jail atıldı. Sebep: **${jailReason}**`)] });

                    interaction.editReply({
                        embeds: [jailEmbed.setDescription(`**${user.tag}** adlı kullanıcı **${interaction.user.tag}** tarafından jaile atıldı.`)],
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