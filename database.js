const mongoose = require("mongoose");

exports.connectMongoose = () => {
    mongoose.connect("mongodb://127.0.0.1:27017/passport")
    .then((e) => console.log(`Connected to MongoDB:${e.connection.host}`))
    .catch((e) => console.log(e));
};

const userSchema = new mongoose.Schema({
    name: String,
    username:{
        type: String,
        required: true,
        unique: true
    },
    password: String,

});

exports.User = mongoose.model("User", userSchema);