const mongoose = require("mongoose");
const d = new Date();

const userFollowSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    Follow: {
        type:Array
    }
}, {
    timestamps: true,
});


module.exports = mongoose.model("Follow", userFollowSchema);