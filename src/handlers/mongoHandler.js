const mongoose = require("mongoose");
const settings = require("../configs/settings.json");

mongoose.connect(settings.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", () => {
    console.log("Database Bağlantısı Tamamlandı");
});
mongoose.connection.on("error", () => {
    console.error("[HATA] Database bağlantısı kurulamadı!");
});