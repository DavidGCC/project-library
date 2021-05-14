const mongoose = require("mongoose");


const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    Comments: [ String ]
});

module.exports = new mongoose.Model("Book", BookSchema);