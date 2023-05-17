const { OAuth2Scopes, Partials, Client, Collection, GatewayIntentBits } = require("discord.js");
const client = global.client = new Client({ fetchAllMembers: true, intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands], partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember, Partials.ThreadMember, Partials.GuildScheduledEvent], ws: { version: "10" } });
const fs = require("fs");
const settings = require("./src/configs/settings.json")
client.commands = new Collection();
client.aliases = new Collection();
client.slashcommands = new Collection();
client.guildPrefixes = new Map();
require("./src/handlers/eventHandler");
require("./src/handlers/commandHandler");
require("./src/handlers/mongoHandler");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const i18next = require("i18next");
const translationBackend = require("i18next-fs-backend");

var slashcommands = [];

fs.readdirSync('./src/slashCommands/').forEach(async category => {
    const commands = fs.readdirSync(`./src/slashCommands/${category}/`).filter(cmd => cmd.endsWith('.js'));
    for (const command of commands) {
        const Command = require(`./src/slashCommands/${category}/${command}`);
        client.slashcommands.set(Command.data.name, Command);
        slashcommands.push(Command.data.toJSON());
    }
});

const rest = new REST({ version: '9' })
    .setToken(settings.TOKEN);
(async () => {
    try {
        console.log('[EİRTİS] Slash Komutları Yükleniyor.');
        await rest.put(
            Routes.applicationCommands(settings.botClientID),
            { body: slashcommands },
        ).then(() => {
            console.log('[EİRTİS] Slash Komutları yüklendi.');
        });
    }
    catch (e) {
        console.error(e);
    }
})();

i18next
    .use(translationBackend)
    .init({
        ns: fs.readdirSync("./src/locales/tr").map(a => a.replace(".json", "")),
        defaultNS: "commands",
        fallbackLng: "tr",
        preload: fs.readdirSync("./src/locales"),
        backend: {
            loadPath: "./src/locales/{{lng}}/{{ns}}.json"
        }
    });

client.login(settings.TOKEN)
    .then(() => console.log(`${client.user.tag} Başarıyla Giriş Yaptı!`))
    .catch((err) => console.log(`Bot Giriş Yapamadı Sebep: ${err}`));