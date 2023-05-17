const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
const db = require("nrc.db");
const settings = require("../../configs/settings.json")

module.exports = {
    conf: {
        aliases: ["erkek", "man", "adam", "k", "kız", "woman", "kadin", "kiz", "kadın", "e"],
        name: "kayıt",
        help: "Sunucuya Kayıt İşlemi Yapar",
        category: "kayıt",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;

        const kayıtYetkili = db.fetch(`kayıt_yetkili_${message.guild.id}`);
        const kayıtErkek = db.fetch(`kayıt_erkek_rol_${message.guild.id}`);
        const kayıtKız = db.fetch(`kayıt_kız_rol_${message.guild.id}`);
        const kayıtKayıtsız = db.fetch(`kayıt_kayıtsız_rol_${message.guild.id}`);
        const kayıtLog = db.fetch(`kayıt_kayıt_log_${message.guild.id}`);
        const kayıtKanal = db.fetch(`kayıt_kayıt_kanal_${message.guild.id}`);
        const kayıtsızİsim = db.fetch(`kayıt_kayıtsız_isim_${message.guild.id}`) || '• İsim | Yaş';

        if (!kayıtYetkili) return message.reply(`**Kayıt Yetkilisi** rolü ayarlanmamış.`);
        if (![kayıtYetkili].some(role => message.member.roles.cache.get(role)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply({ content: `Bu komudu sadece ayarlanan **Kayıt Yetkilisi** veya sunucuyu yönet yetkisine sahip olan kişiler kullanabilir.` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
        }

        if (!kayıtErkek) return message.reply(`**Erkek** rolü ayarlanmamış.`);
        if (!kayıtKız) return message.reply(`**Kız** rolü ayarlanmamış.`);
        if (!kayıtKayıtsız) return message.reply(`**Kayıtsız** rolü ayarlanmamış.`);
        if (!kayıtLog) return message.reply(`**Kayıt Log** kanalı ayarlanmamış.`);
        if (!kayıtKanal) return message.reply(`**Kayıt** kanalı ayarlanmamış.`);

        const member = message.mentions.members.first();
        const isim = args[1];
        const yas = args[2];

        if (!member) return message.reply(`Lütfen kayıt edilecek kişiyi etiketleyiniz.`);
        if (!isim) return message.reply(`Lütfen isim belirtiniz.`);
        if (!yas) return message.reply(`Lütfen yaş belirtiniz.`);
        if (isNaN(yas)) return message.reply(`Yaşlar sayı ile olmalıdır harf içeremez.`);

        const memberRoles = member.roles.cache;
        if (memberRoles.has(kayıtErkek) || memberRoles.has(kayıtKız)) {
            return message.reply("Bu kullanıcı zaten kayıtlı. Kayıtsıza atıp tekrar deneyin. \`e.kayıtsız @Kişi\`");
        }

        if (args[1].length > 32) return message.reply('Girilen isim 32 karakterden fazla olamaz, lütfen daha kısa bir isim giriniz.');

        let kayıtYetkilisi = db.fetch(`kayıt_yetkili_${message.guild.id}_${message.author.id}`);
        if (!kayıtYetkilisi) db.set(`kayıt_yetkili_${message.guild.id}_${message.author.id}`, 0);
        db.add(`kayıt_yetkili_${message.guild.id}_${message.author.id}`, 1);

        const eskiIsim = member.displayName;
        let kayıts = db.fetch(`kayıt_yetkili_${message.guild.id}_${message.author.id}`)


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

        const row = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId("kayittamamlandi")
                    .setLabel("KAYIT TAMAMLANDI")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("1086393444315975820")
                    .setDisabled(true)
            );

        let msg = await message.reply({
            embeds: [embed.setDescription(`
        **${member} kişisini kayıt etmek için aşağıda bulunan cinsiyet butonlarına basabilirsin**

        Yetkilinin Yaptığı Kayıt Sayısı: **${kayıts ? kayıts : "0"}**
        `)], components: [butonlar]
        })

        var filter = (interaction) => interaction.user.id === message.author.id;
        let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })

        collector.on("collect", async (interaction) => {

            if (interaction.customId === "erkek") {
                await interaction.deferUpdate();

                const yeniIsim = `${isim} | ${yas}`;
                await member.setNickname(`${yeniIsim}`);
                await member.roles.remove(kayıtKayıtsız);
                await member.roles.add(kayıtErkek);

                const logChannel = message.guild.channels.cache.get(kayıtLog);
                if (logChannel) logChannel.send({
                    embeds: [embed.setDescription(`**${member.user.tag}** adlı kullanıcı **${message.author.tag}** tarafından erkek olarak kaydedildi.`)
                        .addFields({ name: "Önceki İsim:", value: eskiIsim })
                        .addFields({ name: "Yeni İsim:", value: yeniIsim })
                        .addFields({ name: "Yaş:", value: yas })], components: [row]
                });

                msg.edit({
                    content: `${member} kullanıcısı başarıyla kaydedildi.`, components: [row], embeds: [embed.setDescription(`
                **${member}** adlı kullanıcı başarıyla erkek olarak kaydedildi.
                `)]
                });
            }

            if (interaction.customId === "kadin") {
                await interaction.deferUpdate();

                const yeniIsim = `${isim} | ${yas}`;
                await member.setNickname(`${yeniIsim}`);
                await member.roles.remove(kayıtKayıtsız);
                await member.roles.add(kayıtKız);

                const logChannel = message.guild.channels.cache.get(kayıtLog);
                if (logChannel) logChannel.send({
                    embeds: [embed.setDescription(`**${member.user.tag}** adlı kullanıcı **${message.author.tag}** tarafından erkek olarak kaydedildi.`)
                        .addFields({ name: "Önceki İsim:", value: eskiIsim })
                        .addFields({ name: "Yeni İsim:", value: yeniIsim })
                        .addFields({ name: "Yaş:", value: yas })], components: [row]
                });
                msg.edit({
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