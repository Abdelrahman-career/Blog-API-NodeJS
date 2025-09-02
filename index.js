// يجب أن تكون في الأعلى دائمًا لتحميل متغيرات البيئة
require('dotenv').config();

const express = require("express");
const rateLimit = require('express-rate-limit');
const AppError = require("./utils/AppError");
const connectDB = require('./db-connection');
const createFirstAdmin = require('./utils/createFirstAdmin');

// Routers (استيراد المسارات)
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

// الاتصال بقاعدة البيانات ثم إنشاء أول أدمن إذا لم يكن موجودًا
connectDB().then(() => {
    createFirstAdmin();
});

// Global Middlewares (وسائط عامة)
// 1) للسماح بقراءة الـ JSON القادم في الـ body
app.use(express.json());

// 2) للحد من عدد الطلبات من نفس الـ IP (حماية من هجمات القوة الغاشمة)
const limiter = rateLimit({
    max: 100, // 100 طلب
    windowMs: 60 * 60 * 1000, // خلال ساعة واحدة
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Routes (تركيب المسارات)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);

// Middleware للتعامل مع المسارات غير الموجودة (404)
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler (معالج الأخطاء العام)
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    
    // التعامل مع الأخطاء الشائعة لإعطاء رسائل واضحة
    if (err.code === 11000) { // خطأ الإيميل المكرر
        err.statusCode = 400;
        err.message = "This email is already registered.";
    }
    if (err.name === 'JsonWebTokenError') { // خطأ في التوكن
        err.statusCode = 401;
        err.message = "Invalid token. Please log in again.";
    }
    if (err.name === 'TokenExpiredError') { // خطأ انتهاء صلاحية التوكن
        err.statusCode = 401;
        err.message = "Your token has expired. Please log in again.";
    }

    res.status(err.statusCode).json({
        status: 'fail',
        message: err.message
    });
});

const port = process.env.PORT || 3006;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});