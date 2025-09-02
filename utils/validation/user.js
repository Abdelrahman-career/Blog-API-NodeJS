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
  // ✅  تعديل لجعل كلمة المرور أقوى
  password: Joi.string()
    .min(8) // على الأقل 8 أحرف
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')) // يجب أن تحتوي على حرف صغير، كبير، ورقم
    .required()
    .messages({
      'string.min': 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
      'string.pattern.base': 'كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، ورقم على الأقل',
      'any.required': 'حقل كلمة المرور مطلوب'
  }),
  passwordConfirm: Joi.any().equal(Joi.ref('password')).required().messages({
    'any.only': 'تأكيد كلمة المرور لا يطابق كلمة المرور',
    'any.required': 'حقل تأكيد كلمة المرور مطلوب'
  })
});

module.exports = userValidationSchema;