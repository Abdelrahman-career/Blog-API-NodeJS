const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This creates the link to the User model
        required: true,
    },
    image: { type: String },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;