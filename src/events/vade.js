const ms = require("ms");
const db = require('nrc.db');

module.exports = async (message) => {

    setTimeout(() => {
        let liste = db.fetch(`vadeli_hesaplar`);
        if (!liste) return;
        liste = Array.isArray(liste) ? liste : [liste];
        liste.forEach(elem => {
            let coin = db.fetch(`banka_coin_vadeli_${elem}`);
            let miktar = Number(coin);
            if (!miktar || miktar === 0) return;
            var son = (miktar * 5) / 100;
            db.add(`banka_coin_vadeli_${elem}`, son);
            message.reply(`<@${elem}> isimli kişinin vadeli kazancı **${son}** miktar coindir. `);
        });
    }, ms("4h"));

};

module.exports.conf = {
    name: "messageCreate",
};