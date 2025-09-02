const Joi = require("joi");

const userValidationSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.empty': 'حقل الاسم لا يمكن أن يكون فارغًا',
    'string.min': 'الاسم يجب أن يكون على الأقل 3 أحرف',
    'any.required': 'حقل الاسم مطلوب'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'الرجاء إدخال بريد إلكتروني صالح',
    'any.required': 'حقل البريد الإلكتروني مطلوب'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'كلمة المرور يجب أن تكون على الأقل 6 أحرف',
    'any.required': 'حقل كلمة المرور مطلوب'
  }),
  passwordConfirm: Joi.any().equal(Joi.ref('password')).required().messages({
    'any.only': 'تأكيد كلمة المرور لا يطابق كلمة المرور',
    'any.required': 'حقل تأكيد كلمة المرور مطلوب'
  })
});

module.exports = userValidationSchema;