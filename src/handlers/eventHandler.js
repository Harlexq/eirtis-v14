const fs = require("fs");
const client = global.client;

fs.readdir("./src/events", (err, files) => {
    if (err) return console.error(err);
    files
        .filter((file) => file.endsWith(".js"))
        .forEach((file) => {
            let eirtis = require(`../events/${file}`);
            if (!eirtis.conf) return;
            client.on(eirtis.conf.name, eirtis);
            console.log(`[EİRTİS EVENT] ${eirtis.conf.name} Eventi Yüklendi`);
        });
});
