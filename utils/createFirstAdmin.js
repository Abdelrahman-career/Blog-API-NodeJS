const User = require('../models/user');
const bcrypt = require('bcrypt');

const createFirstAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            console.log('Admin account not found, attempting to create...');
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
            
            // ✅ بداية التحسين: إضافة try/catch داخلي
            try {
                await User.create({
                    name: 'Admin',
                    email: adminEmail,
                    password: hashedPassword,
                    role: 'admin'
                });
                console.log('First admin account created successfully.');
            } catch (error) {
                // يتعامل بذكاء مع خطأ التكرار إذا حدث
                if (error.code === 11000) {
                    console.log('Admin account was created by another instance. No action needed.');
                } else {
                    console.error('Error creating first admin during create call:', error);
                }
            }
        } else {
            console.log('Admin account already exists.');
        }
    } catch (error) {
        console.error('Error checking for first admin:', error);
    }
};

module.exports = createFirstAdmin;