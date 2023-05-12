const { SlashCommandBuilder } = require('discord.js');
const db = require('nrc.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kayıt-stat')
        .setDescription("Kayıt yetkilisinin istatistiklerini gösterir.")
        .addUserOption(option =>
            option
                .setName("kişi")
                .setDescription("Kayıt statına bakmak istediğiniz üyeyi belirtiniz.")
        ),
    async execute(interaction, client, embed) {

        if (!interaction.guild) return;

        let kayıt_ytk = db.fetch(`kayıt_yetkili_${interaction.guild.id}`);
        let kayıt_erkek = db.fetch(`kayıt_erkek_rol_${interaction.guild.id}`);
        let kayıt_kız = db.fetch(`kayıt_kız_rol_${interaction.guild.id}`);
        let kayıtsız = db.fetch(`kayıt_kayıtsız_rol_${interaction.guild.id}`);
        let kayıt_log = db.fetch(`kayıt_kayıt_log_${interaction.guild.id}`);
        let kayıt_kanal = db.fetch(`kayıt_kayıt_kanal_${interaction.guild.id}`);

        if (!kayıt_ytk) return interaction.reply(`**Kayıt Yetkilisi** rolü ayarlanmamış.`);
        if (![kayıt_ytk].some(role => interaction.member.roles.cache.get(role)) && (!interaction.member.permissions.has("ADMINISTRATOR")))
            return interaction.reply({ content: `Bu Komudu Sadece Ayarlanan **Kayıt Yetkilisi** Veya Sunucuyu Yönet Yetkisine Sahip Olan Kişiler Kullanabilir` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
        if (!kayıt_erkek) return interaction.reply(`**Erkek** rolü ayarlanmamış.`);
        if (!kayıt_kız) return interaction.reply(`**Kız** rolü ayarlanmamış.`);
        if (!kayıtsız) return interaction.reply(`**Kayıtsız** rolü ayarlanmamış.`);
        if (!kayıt_log) return interaction.reply(`**Kayıt Log** kanalı ayarlanmamış.`);
        if (!kayıt_kanal) return interaction.reply(`**Kayıt** kanalı ayarlanmamış.`);

        let member = interaction.options.getUser('kişi') || interaction.user;
        let kayıt = db.fetch(`kayıt_yetkili_${interaction.guild.id}_${member.id}`);

        if (![kayıt_ytk].some(role => interaction.member.roles.cache.get(role)) && (!interaction.member.permissions.has("ADMINISTRATOR")))
            return interaction.reply({ content: `Bu Komudu Sadece Ayarlanan **Mute Yetkilisi** Veya Sunucuyu Yönet Yetkisine Sahip Olan Kişiler Kullanabilir` }).then((e) => setTimeout(() => { e.delete(); }, 5000));

        interaction.reply({
            embeds: [embed.setTitle("Kayıt İstatistikleri")
                .setDescription(`
        Kayıt İşlemlerini Yapan Kişi: ${member}\nYaptığı Kayıt Sayısı: **${kayıt ? kayıt : "Yok"}**

        Komut ${interaction.user.tag} tarafından kullanıldı
        `)
            ]
        });
    },
};