const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const db = require('nrc.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kayıtsız')
        .setDescription('Etiketlenen kişiyi kayıtsız rolüne atar')
        .addUserOption(option =>
            option.setName('kişi')
                .setDescription('Kayıtsıza atmak istediğiniz üyeyi belirtiniz.')
                .setRequired(true)
        ),
    async execute(interaction, client, embed) {
        let kayit_yetkili = db.fetch(`kayıt_yetkili_${interaction.guild.id}`);
        let kayit_erkek = db.fetch(`kayıt_erkek_rol_${interaction.guild.id}`);
        let kayit_kiz = db.fetch(`kayıt_kız_rol_${interaction.guild.id}`);
        let kayitsiz = db.fetch(`kayıt_kayıtsız_rol_${interaction.guild.id}`);
        let kayit_log = db.fetch(`kayıt_kayıt_log_${interaction.guild.id}`);
        let kayit_kanal = db.fetch(`kayıt_kayıt_kanal_${interaction.guild.id}`);
        let kayıtsızİsim = db.fetch(`kayıt_kayıtsız_isim_${interaction.guild.id}`) || '• İsim | Yaş';

        if (!kayit_yetkili) return interaction.reply({ content: '**Kayıt yetkilisi** rolü ayarlanmamış.' });
        if (![kayit_yetkili].some(role => interaction.member.roles.cache.get(role)) && !interaction.member.permissions.has('ADMINISTRATOR'))
            return interaction.reply({ content: 'Bu komudu sadece ayarlanan **mute yetkilisi** veya sunucuyu yönet yetkisine sahip olan kişiler kullanabilir.' }).then((e) => setTimeout(() => { e.delete(); }, 5000));
        if (!kayit_erkek) return interaction.reply({ content: '**Erkek** rolü ayarlanmamış.' });
        if (!kayit_kiz) return interaction.reply({ content: '**Kız** rolü ayarlanmamış.' });
        if (!kayitsiz) return interaction.reply({ content: '**Kayıtsız** rolü ayarlanmamış.' });
        if (!kayit_log) return interaction.reply({ content: '**Kayıt Log** kanalı ayarlanmamış.' });
        if (!kayit_kanal) return interaction.reply({ content: '**Kayıt** kanalı ayarlanmamış.' });

        let member = interaction.options.getMember('kişi');

        if (!member) return interaction.reply({ content: 'Lütfen kayıtsıza düşürülecek kişiyi etiketleyiniz.' });

        let uye = interaction.guild.members.cache.get(member.id);

        if (!uye.roles || uye.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ content: "Belirttiğiniz kişi sizinle aynı yetkiye sahip veya sizden daha yetkili.", ephemeral: true });
        }

        await uye.roles.add(kayitsiz);
        await üye.setNickname(`${kayıtsızİsim}`);
        await uye.roles.remove(kayit_erkek);
        await uye.roles.remove(kayit_kiz);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("kayitsizadüstü")
                    .setLabel("Kayıtsıza Düşürüldü")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("1086393444315975820")
                    .setDisabled(true)

            );

        interaction.reply({
            content: `${uye} üyesi başarıyla kayıtsıza atıldı.`, embeds: [embed.setDescription(`
        Kayıtsıza düşürülen kişinin bilgileri;
        
        Düşürülen kişi : ${uye}
        
        
        Kayıt yetkilisin bilgileri;
        Kayıtsız yapan kişi : ${interaction.user}
        `)], components: [row]
        });

        const log = interaction.guild.channels.cache.get(kayit_log);

        if (!log) return;

        log.send({
            content: `${uye} üyesi başarıyla kayıtsıza atıldı.`, embeds: [embed.setDescription(`
        Kayıtsıza düşürülen kişinin bilgileri;
        
        Düşürülen kişi : ${uye}
        
        
        Kayıt yetkilisin bilgileri;
        Kayıtsız yapan kişi : ${interaction.user}
        `)], components: [row]
        });
    },
};