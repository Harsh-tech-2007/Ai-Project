const mongoose = require('mongoose')


const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [ true, "token is required to be added in blacklist" ]
    },
    createdAt: {           // add
        type: Date,        // add
        default: Date.now, // add
        expires: 86400     // add - auto-delete after 24h, matches JWT expiry of "1d"
    }
})

const tokenBlacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema)


module.exports = tokenBlacklistModel