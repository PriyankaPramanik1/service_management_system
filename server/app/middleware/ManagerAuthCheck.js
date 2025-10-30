// Updated Auth middleware - middleware/UserAuthCheck.js
const jwt = require("jsonwebtoken");
const User = require('../model/userModel'); // Import your User model

const Auth = async (req, res, next) => {
    try {
        if (req.cookies && req.cookies.managerToken) {
            const decoded = jwt.verify(
                req.cookies.managerToken, 
                process.env.JWT_SECRET_MANAGER || "hellowelcomeManager123456"
            );
            
            // Fetch fresh user data from database
            const manager = await User.findById(decoded.id || decoded._id);
            
            if (!manager) {
                console.log('❌ manager not found in database');
                return res.status(401).json({
                    success: false,
                    message: 'manager not found'
                });
            }
            
            // Set req.user with proper structure
            req.manager = {
                _id: manager._id,
                id: manager._id.toString(),
                email: manager.email,
                name: manager.name
                // Add other fields you need
            };
            
            console.log('✅ manager authenticated:', req.manager._id);
            next();
        } else {
            console.log('❌ No userToken found in cookies');
            req.manager = null;
            next();
        }
    } catch (error) {
        console.error('❌ Auth middleware error:', error.message);
        req.manager = null;
        next();
    }
};

module.exports = Auth;