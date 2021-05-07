const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    postcolor: {type: String, required: true},
    postusername: {type: String, required: true},
    postimgname: {type: String, required: true},
});
  
const Posts = mongoose.model("Posts", postSchema);

module.exports = Posts