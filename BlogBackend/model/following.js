const mongoose = require("mongoose");
const d = new Date();

const userFollowingSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    Following: {
        type:Array
    }
}, {
    timestamps: true,
});


module.exports = mongoose.model("Following", userFollowingSchema);