const User = require('../models/user');
const bcrypt = require('bcrypt');

const createFirstAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
            await User.create({
                name: 'Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
            console.log('First admin account created successfully.');
        }
    } catch (error) {
        console.error('Error creating first admin:', error);
    }
};

module.exports = createFirstAdmin;