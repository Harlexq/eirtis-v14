module.exports = {
    conf: {
        aliases: ["say"],
        name: "say",
        help: "Sunucunun Ses Ve Chat Bilgilerini Gösterir",
        category: "moderasyon",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;

        message.reply({
            embeds: [embed.setTitle(`${message.guild.name} İçin Bilgiler`)
                .setDescription(`
        **__Kullanıcı__**
        **${message.guild.memberCount}** Kişi Var
        
        **Online** : ${message.guild.members.cache.filter(mem => !mem.user.bot && mem.presence?.status === 'online').size}
        **Dnd** : ${message.guild.members.cache.filter(mem => !mem.user.bot && mem.presence?.status === 'dnd').size}
        **İdle** : ${message.guild.members.cache.filter(mem => !mem.user.bot && mem.presence?.status === 'idle').size}
        **Sesli Kanallarda** : ${message.guild.members.cache.filter(mem => mem.voice.channel).size}
        
        **__Kanal__**
        **Ses** : ${message.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size}
        **Kanal** : ${message.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size}
        `)]
        })

    },
}