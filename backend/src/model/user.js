const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true,"Username already taken"]
    },
    email: {
        type: String,
        required: [ true, "Email is required" ],
        unique: [true,"Email already taken"]
    },
    password: {
        type: String,
        required: [ true, "Password is required" ]
    },
 
})

const userModel = mongoose.model("Users", userSchema)

module.exports = userModel;