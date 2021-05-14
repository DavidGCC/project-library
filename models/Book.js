const mongoose = require("mongoose");


const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    comments: [ String ]
});

BookSchema.set("toJSON", {
    transform: (obj, res) => {
        delete res.__v;
    }
});

module.exports = new mongoose.model("Book", BookSchema);