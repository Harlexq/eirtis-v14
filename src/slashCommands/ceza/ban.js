const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Belirtilen kullanıcıyı banlar.')
        .addUserOption(option =>
            option.setName('kullanıcı')
                .setDescription('Banlanacak kullanıcıyı seçin.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('sebep')
                .setDescription('Banlama sebebini girin.')
                .setRequired(true)
        ),
    async execute(interaction, client, embed) {
        const user = interaction.options.getUser('kullanıcı');
        const reason = interaction.options.getString('sebep');

        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return interaction.reply('Üyeleri Banla yetkiniz yok.');
        }

        if (!user) {
            return interaction.reply('Lütfen banlanacak kişiyi belirtiniz.');
        }

        if (!reason) {
            return interaction.reply('Lütfen banlama sebebini belirtiniz.');
        }

        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply('Belirtilen kullanıcı sunucuda bulunamadı.');
        }

        if (!member.bannable) {
            return interaction.reply('Bu kişiyi banlayamam. Botumun yetkisi banlama işlemi için yeterli değil.');
        }

        if (member.id === interaction.user.id) {
            return interaction.reply('Kendinizi banlayamazsınız.');
        }

        if (member.id === interaction.client.user.id) {
            return interaction.reply('Beni banlayamazsınız.');
        }

        if (!member.roles || member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply('Belirttiğiniz kişi sizinle aynı yetkiye sahip veya sizden daha yetkili.');
        }

        if (!interaction.member.roles || member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply('Belirttiğiniz kişi botun yetkisiyle aynı veya daha üst bir yetkiye sahip.');
        }

        await member.ban({ reason: reason });

        interaction.reply({
            content: `${member} başarıyla banlandı`,
            embeds: [
                {
                    description: `
            **Banlayan Kişi:** ${interaction.user}
            **Banlanan Kişi:** ${member}
            **Sebep:** ${reason}
          `
                }
            ]
        });
    }
};
