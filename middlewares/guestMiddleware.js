const AppError = require('../utils/AppError');

// هذا الـ middleware يمنع المستخدم المسجل دخوله من الوصول لمسارات معينة (مثل التسجيل)
const preventIfLoggedIn = (req, res, next) => {
    // نتحقق إذا كان هناك توكن في الـ headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // إذا وجدنا توكن، فهذا يعني أن المستخدم مسجل دخوله
        return next(new AppError('أنت مسجل دخولك بالفعل، لا يمكنك الوصول لهذه الصفحة.', 403)); // 403 Forbidden
    }
    // إذا لم يكن هناك توكن، اسمح له بالمرور
    next();
};

module.exports = { preventIfLoggedIn };