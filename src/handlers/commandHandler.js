const fs = require("fs");

fs.readdir('./src/commands/', (err, files) => {
    if (err) console.error(err);
    console.log(`[EİRTİS] ${files.length} Komut Klasörü Yüklenecek`);
    files.forEach(f => {
        fs.readdir(`./src/commands/${f}`, (err2, files2) => {
            files2.forEach(file => {
                let eirtis = require(`../commands/${f}/` + file);
                console.log(`[EİRTİS KOMUT] ${eirtis.conf.name} Komutu Yüklendi`);
                client.commands.set(eirtis.conf.name, eirtis);
                eirtis.conf.aliases.forEach(alias => {
                    client.aliases.set(alias, eirtis.conf.name);
                });
            })
        })
    });
});
