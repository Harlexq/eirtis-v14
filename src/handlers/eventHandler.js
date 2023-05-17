const fs = require("fs");
const client = global.client;

fs.readdir("./src/events", (err, folders) => {
    if (err) return console.error(err);
    folders.forEach((folder) => {
        fs.readdir(`./src/events/${folder}`, (err, files) => {
            if (err) return console.error(err);
            files.filter((file) => file.endsWith(".js")).forEach((file) => {
                const event = require(`../events/${folder}/${file}`);
                if (!event.conf) return;
                client.on(event.conf.name, event);
                console.log(`[EİRTİS EVENT] ${event.conf.name} Eventi Yüklendi`);
            });
        });
    });
});