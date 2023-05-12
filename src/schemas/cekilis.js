const mongoose = require("mongoose");

const cekilisSchema = new mongoose.Schema({
    messageID: { type: String, required: true },
    katilan: { type: Array, required: true },
    time: { type: String, required: true },
});

module.exports = mongoose.model("Cekilis", cekilisSchema);
