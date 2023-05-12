const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const db = require('nrc.db');
const settings = require("../../configs/settings.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kayıt')
        .setDescription('Sunucuya Kayıt İşlemi Yapar')
        .addUserOption(option =>
            option.setName('kullanıcı')
                .setDescription('Kaydedilecek kullanıcı.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('isim')
                .setDescription('Kaydedilecek kullanıcının ismi.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('yaş')
                .setDescription('Kaydedilecek kullanıcının yaşı.')
                .setRequired(true)),
    async execute(interaction, client, embed) {

        const kayıtYetkili = db.fetch(`kayıt_yetkili_${interaction.guild.id}`);
        const kayıtErkek = db.fetch(`kayıt_erkek_rol_${interaction.guild.id}`);
        const kayıtKız = db.fetch(`kayıt_kız_rol_${interaction.guild.id}`);
        const kayıtKayıtsız = db.fetch(`kayıt_kayıtsız_rol_${interaction.guild.id}`);
        const kayıtLog = db.fetch(`kayıt_kayıt_log_${interaction.guild.id}`);
        const kayıtKanal = db.fetch(`kayıt_kayıt_kanal_${interaction.guild.id}`);
        const kayıtsızİsim = db.fetch(`kayıt_kayıtsız_isim_${interaction.guild.id}`) || '• İsim | Yaş';

        if (!kayıtYetkili) return interaction.reply(`**Kayıt Yetkilisi** rolü ayarlanmamış.`);
        if (![kayıtYetkili].some(role => interaction.member.roles.cache.get(role)) && !interaction.member.permissions.has("ADMINISTRATOR")) {
            return interaction.reply({ content: `Bu komudu sadece ayarlanan **Kayıt Yetkilisi** veya sunucuyu yönet yetkisine sahip olan kişiler kullanabilir.` });
        }
        if (!kayıtErkek) return interaction.reply(`**Erkek** rolü ayarlanmamış.`);
        if (!kayıtKız) return interaction.reply(`**Kız** rolü ayarlanmamış.`);
        if (!kayıtKayıtsız) return interaction.reply(`**Kayıtsız** rolü ayarlanmamış.`);
        if (!kayıtLog) return interaction.reply(`**Kayıt Log** kanalı ayarlanmamış.`);
        if (!kayıtKanal) return interaction.reply(`**Kayıt** kanalı ayarlanmamış.`);

        const member = interaction.options.getMember('kullanıcı');
        const isim = interaction.options.getString('isim');
        const yas = interaction.options.getString('yaş');

        if (!member) return interaction.reply(`Lütfen kayıt edilecek kişiyi etiketleyiniz.`);
        if (!isim) return interaction.reply(`Lütfen isim belirtiniz.`);
        if (!yas) return interaction.reply(`Lütfen yaş belirtiniz.`);
        if (isNaN(yas)) return interaction.reply(`Yaşlar sayı ile olmalıdır harf içeremez.`);

        let kayıtYetkilisi = db.fetch(`kayıt_yetkili_${interaction.guild.id}_${interaction.user.id}`);
        if (!kayıtYetkilisi) db.set(`kayıt_yetkili_${interaction.guild.id}_${interaction.user.id}`, 0);
        db.add(`kayıt_yetkili_${interaction.guild.id}_${interaction.user.id}`, 1);
        const üye = interaction.options.getUser('kullanıcı');
        if (!üye) return interaction.reply('Kullanıcı seçeneği bulunamadı.');


        if (!member.roles || member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ content: "Belirttiğiniz kişi sizinle aynı yetkiye sahip veya sizden daha yetkili.", ephemeral: true });
        }

        const eskiIsim = member.displayName;
        let kayıts = db.fetch(`kayıt_yetkili_${interaction.guild.id}_${interaction.user.id}`)

        const butonlar = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('erkek')
                    .setLabel('Erkek')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("1093902136439488604"),
                new ButtonBuilder()
                    .setCustomId('kadin')
                    .setLabel('Kadın')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji("1093902476966637649"),
                new ButtonBuilder()
                    .setCustomId("iptal")
                    .setLabel("İptal")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("1086393445574262836"),
            );


        let msg = await interaction.reply({
            embeds: [embed.setDescription(`
        **${member} kişisini kayıt etmek için aşağıda bulunan cinsiyet butonlarına basabilirsin**

        Yetkilinin Yaptığı Kayıt Sayısı: **${kayıts ? kayıts : "0"}**
        `)], components: [butonlar]
        })


        var filter = (interaction) => interaction.user.id;
        let collector = await interaction.channel.createMessageComponentCollector({ filter, time: 30000 })

        collector.on("collect", async (interaction) => {

            if (interaction.customId === "erkek") {
                await interaction.deferUpdate();

                const yeniIsim = `${isim} | ${yas}`;
                await member.setNickname(`${yeniIsim}`);

                const row = new ActionRowBuilder()
                    .addComponents(

                        new ButtonBuilder()
                            .setCustomId("kayittamamlandi")
                            .setLabel("KAYIT TAMAMLANDI")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("1086393444315975820")
                            .setDisabled(true)

                    );
                await member.roles.remove(kayıtKayıtsız);
                await member.roles.add(kayıtErkek);

                const logChannel = interaction.guild.channels.cache.get(kayıtLog);
                if (logChannel) logChannel.send({
                    embeds: [embed.setDescription(`
                    **${member.user.tag}** adlı kullanıcı **${interaction.user.tag}** tarafından erkek olarak kaydedildi.

                    ${interaction.user.tag} tarafından kaydedildi.
                    `)
                        .addFields({ name: "Önceki İsim:", value: eskiIsim })
                        .addFields({ name: "Yeni İsim:", value: yeniIsim })
                        .addFields({ name: "Yaş:", value: yas })], components: [row]
                });

                await interaction.editReply({
                    content: `${member} kullanıcısı başarıyla kaydedildi.`, components: [row], embeds: [embed.setDescription(`
                **${member}** adlı kullanıcı başarıyla erkek olarak kaydedildi.
                `)]
                });
            }

            if (interaction.customId === "kadin") {
                await interaction.deferUpdate();

                const yeniIsim = `${isim} | ${yas}`;
                await member.setNickname(`${yeniIsim}`);

                const row = new ActionRowBuilder()
                    .addComponents(

                        new ButtonBuilder()
                            .setCustomId("kayittamamlandi")
                            .setLabel("KAYIT TAMAMLANDI")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("1086393444315975820")
                            .setDisabled(true)

                    );
                await member.roles.remove(kayıtKayıtsız);
                await member.roles.add(kayıtKız);

                const logChannel = interaction.guild.channels.cache.get(kayıtLog);
                if (logChannel) logChannel.send({
                    embeds: [embed.setDescription(`
                **${member.user.tag}** adlı kullanıcı **${interaction.user.tag}** tarafından erkek olarak kaydedildi.

                ${interaction.user.tag} tarafından kaydedildi.
                `)
                        .addFields({ name: "Önceki İsim:", value: eskiIsim })
                        .addFields({ name: "Yeni İsim:", value: yeniIsim })
                        .addFields({ name: "Yaş:", value: yas })], components: [row]
                });

                await interaction.editReply({
                    content: `${member} kullanıcısı başarıyla kaydedildi.`, components: [row], embeds: [embed.setDescription(`
                **${member}** adlı kullanıcı başarıyla kız olarak kaydedildi.
                `)]
                });
            }

            if (interaction.customId === "iptal") {
                if (msg) {
                    await msg.edit({ content: `İşlem Başarıyla İptal Edildi ${settings.emoji.green}`, ephemeral: true, embeds: [], components: [] });
                    await member.setNickname(`${kayıtsızİsim}`);
                    await member.roles.add(kayıtKayıtsız);
                    await member.roles.remove(kayıtKız);
                    await member.roles.remove(kayıtErkek);
                }
            }
        })

    },
};