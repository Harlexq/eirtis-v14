const { SlashCommandBuilder } = require('discord.js');
const db = require("nrc.db")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('isim')
        .setDescription('Etiketlenen Kişinin İsmini Değiştirir')
        .addUserOption(option =>
            option.setName('kullanıcı')
                .setDescription('İsmi değiştirilecek kişiyi seçin.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('isim')
                .setDescription('Yeni ismi girin.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('yas')
                .setDescription('Yeni yaşını girin.')
                .setRequired(true)),
    async execute(interaction, client, embed) {
        const member = interaction.options.getMember('kullanıcı');
        const isim = interaction.options.getString('isim');
        const yas = interaction.options.getInteger('yas');
        const kayıt_ytk = db.fetch(`kayıt_yetkili_${interaction.guild.id}`);
        const kayıt_erkek = db.fetch(`kayıt_erkek_rol_${interaction.guild.id}`);
        const kayıt_kız = db.fetch(`kayıt_kız_rol_${interaction.guild.id}`);
        const kayıtsız = db.fetch(`kayıt_kayıtsız_rol_${interaction.guild.id}`);
        const kayıt_log = db.fetch(`kayıt_kayıt_log_${interaction.guild.id}`);
        const kayıt_kanal = db.fetch(`kayıt_kayıt_kanal_${interaction.guild.id}`);

        if (!kayıt_ytk) return interaction.reply(`**Kayıt Yetkilisi** rolü ayarlanmamış.`);
        if (![kayıt_ytk].some(role => interaction.member.roles.cache.get(role)) && (!interaction.member.permissions.has("ADMINISTRATOR"))) {
            return interaction.reply({ content: `Bu Komudu Sadece Ayarlanan **Mute Yetkilisi** Veya Sunucuyu Yönet Yetkisine Sahip Olan Kişiler Kullanabilir`, ephemeral: true });
        }
        if (!kayıt_erkek) return interaction.reply(`**Erkek** rolü ayarlanmamış.`);
        if (!kayıt_kız) return interaction.reply(`**Kız** rolü ayarlanmamış.`);
        if (!kayıtsız) return interaction.reply(`**Kayıtsız** rolü ayarlanmamış.`);
        if (!kayıt_log) return interaction.reply(`**Kayıt Log** kanalı ayarlanmamış.`);
        if (!kayıt_kanal) return interaction.reply(`**Kayıt** kanalı ayarlanmamış.`);

        if (!member.roles || member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ content: "Belirttiğiniz kişi sizinle aynı yetkiye sahip veya sizden daha yetkili.", ephemeral: true });
        }

        try {
            await member.setNickname(`${isim} | ${yas}`);
            interaction.reply({ embeds: [embed.setDescription(`${member} adlı kullanıcının ismi başarıyla "${isim} | ${yas}" olarak değiştirildi.`)] });
        } catch (error) {
            return interaction.reply({ content: "İsim değiştirilirken bir hata oluştu.", ephemeral: true });
        }

        const logkanal = interaction.guild.channels.cache.get(kayıt_log)
        logkanal.send({
            embeds: [embed.setDescription(`
        ${member.user.tag} adlı kişinin ismi "${isim} | ${yas}" olarak değiştirildi.`)]
        })
    },
};