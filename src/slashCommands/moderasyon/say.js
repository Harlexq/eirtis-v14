const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Sunucunun Ses Ve Chat Bilgilerini Gösterir'),
    async execute(interaction, client, embed) {
        interaction.reply({
            embeds: [embed.setTitle(`${interaction.guild.name} İçin Bilgiler`)
                .setDescription(`
**__Kullanıcı__**
**${interaction.guild.memberCount}** Kişi Var

**Online** : ${interaction.guild.members.cache.filter(mem => !mem.user.bot && mem.presence?.status === 'online').size}
**Dnd** : ${interaction.guild.members.cache.filter(mem => !mem.user.bot && mem.presence?.status === 'dnd').size}
**İdle** : ${interaction.guild.members.cache.filter(mem => !mem.user.bot && mem.presence?.status === 'idle').size}
**Sesli Kanallarda** : ${interaction.guild.members.cache.filter(mem => mem.voice.channel).size}

**__Kanal__**
**Ses** : ${interaction.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size}
**Kanal** : ${interaction.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size}
`)]
        })
    },
};