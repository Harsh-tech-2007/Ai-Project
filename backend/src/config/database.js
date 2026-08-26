const mongoose = require("mongoose");
const config = require("./config.js");

async function connectDB() {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("Connected to DB");
    } catch (error) {
        console.error("DB connection failed:", error.message);
        process.exit(1); 
    }
}

module.exports = connectDB;