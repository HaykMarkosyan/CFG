const mongoose = require("mongoose")
const Schema = mongoose.Schema

const gameSchema = new Schema({
    gametitle: String,
    gamedescription: String,
    gameimgname: String,
    gamename: String,
});
  
const Games = mongoose.model("Games", gameSchema);

module.exports = Games