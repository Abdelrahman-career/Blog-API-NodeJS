const express = require('express');
const { getAllPosts, createPost, getPostById, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// حماية كل المسارات التالية، يجب أن يكون المستخدم مسجلاً دخوله
router.use(protect);

router
    .route('/')
    .get(getAllPosts)
    .post(createPost);

router
    .route('/:id')
    .get(getPostById)
    .patch(updatePost) // نستخدم patch للتعديلات الجزئية
    .delete(deletePost);

module.exports = router;