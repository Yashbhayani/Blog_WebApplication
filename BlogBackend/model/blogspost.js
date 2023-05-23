const mongoose = require("mongoose");
const d = new Date();

const blogsPostSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    Blog_Title: {
        type: String,
        require: true
    },
    Blogs_Description: {
        type: String,
        require: true
    },
    Blog_content: {
        type: Array,
        require: true
    },
    Hastag: {
        type: Array,
    },
    Like: {
        type: Map,
        of: Boolean,
    },
    comments: {
        type:Array
    },
    Date: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
});


module.exports = mongoose.model("Blogspost", blogsPostSchema);