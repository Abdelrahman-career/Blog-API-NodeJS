const Post = require('../models/post');
const User = require('../models/user'); // للتأكد من وجود المستخدم في النسخ القديمة
const AppError = require('../utils/AppError');

// @desc    Get all posts
// @route   GET /api/v1/posts
// @access  Private
exports.getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().populate('authorId', 'name email');
        res.status(200).json({
            status: 'success',
            results: posts.length,
            data: {
                posts
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new post
// @route   POST /api/v1/posts
// @access  Private
exports.createPost = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        // الصحيح: جلب هوية المستخدم من التوكن (بعد المرور على middleware الحماية)
        const authorId = req.user.id;

        const newPost = await Post.create({ title, content, authorId });

        res.status(201).json({
            status: 'success',
            data: {
                post: newPost
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single post
// @route   GET /api/v1/posts/:id
// @access  Private
exports.getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id).populate('authorId', 'name email');
        if (!post) {
            return next(new AppError('No post found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                post
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a post
// @route   PATCH /api/v1/posts/:id
// @access  Private (Author only)
exports.updatePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return next(new AppError('No post found with that ID', 404));
        }

        // التحقق من الصلاحية: هل المستخدم هو صاحب المنشور؟
        if (post.authorId.toString() !== req.user.id) {
            return next(new AppError('You are not authorized to update this post', 403)); // 403 Forbidden
        }

        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                post: updatedPost
            }
        });
    } catch (error) {
        next(error);
    }
};


// @desc    Delete a post
// @route   DELETE /api/v1/posts/:id
// @access  Private (Author or Admin)
exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return next(new AppError('No post found with that ID', 404));
        }

        // التحقق من الصلاحية: هل المستخدم هو صاحب المنشور أو أدمن؟
        if (post.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new AppError('You do not have permission to delete this post', 403));
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(error);
    }
};