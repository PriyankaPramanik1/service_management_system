const UserModel = require('../model/userModel')
const { userValidation } = require('../helper/validation')
const ComparePassword = require('../helper/ComparePassword')
const OtpEmailVerify = require('../helper/OtpEmailVerify');
const StatusCode = require('../helper/statusCode')
const { HashedPassword, RandomPassword } = require('../helper/HashedPassword')
const OtpModel = require('../model/otpModel')
const Feedback = require('../model/feedbackModel')
const jwt = require('jsonwebtoken')
class UserController {
    // create Users
    async createUser(req, res) {
        try {
            // Validate user input
            const { error } = userValidation().validate(req.body);
            if (error) {
                req.flash('error', error.message);
                return res.status(StatusCode.BAD_REQUEST).json({ message: error.message });
            }

            // Check if user already exists
            const existingUser = await UserModel.findOne({ email: req.body.email });
            if (existingUser) {
                req.flash('error', "Email already exists");
                return res.status(StatusCode.SERVICE_UNAVAILABLE).json({ message: 'Email already exists' });
            }

            // Hash password and create new user
            const hashedPassword = await HashedPassword(req.body.password);
            const user = new UserModel({ ...req.body, password: hashedPassword });
            const savedUser = await user.save();
            OtpEmailVerify(req, savedUser);
            return res.json({ success: true, message: 'User created successfully' });
        } catch (error) {
            console.error(error);
            req.flash('error', 'Error creating user');
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error creating user' });
        }
    }


    // verify Users
    async verify(req, res) {
        try {
            const { email, otp } = req.body;
            // Check if all required fields are provided
            if (!email || !otp) {
                req.flash('error', 'All fields are required');
                return res.status(400).json({ status: false, message: "All fields are required" });
            }
            const existingUser = await UserModel.findOne({ email });

            // Check if email doesn't exists
            if (!existingUser) {
                req.flash('error', 'Email does not exists');
                return res.status(404).json({ status: "failed", message: "Email doesn't exists" });
            }

            // Check if email is already verified
            if (existingUser.is_verified) {
                req.flash('success', 'User verified successfully!');
                return res.json({ success: true, message: 'User verified successfully!' });
            }
            // Check if there is a matching email verification OTP
            const emailVerification = await OtpModel.findOne({ userId: existingUser._id, otp });
            if (!emailVerification) {
                if (!existingUser.is_verified) {
                    // console.log(existingUser);
                    await OtpEmailVerify(req, existingUser);
                    req.flash('success', 'Verified successful');
                    // return res.status(400).json({ status: false, message: "Invalid OTP, new OTP sent to your email" });
                }
                return res.status(400).json({ status: false, message: "Invalid OTP" });
            }
            // Check if OTP is expired
            const currentTime = new Date();
            // 1 * 60 * 1000 calculates the expiration period in milliseconds(15 minutes).
            const expirationTime = new Date(emailVerification.createdAt.getTime() + 1 * 60 * 1000);
            if (currentTime > expirationTime) {
                // OTP expired, send new OTP
                await OtpEmailVerify(req, existingUser);
                req.flash('error', 'OTP expired, new OTP sent to your email');
                // return res.status(400).json({ status: "failed", message: "OTP expired, new OTP sent to your email" });
            }
            const timeLeft = Math.floor((expirationTime - currentTime) / 1000); // in seconds
            console.log(timeLeft);

            // OTP is valid and not expired, mark email as verified
            existingUser.is_verified = true;
            await existingUser.save();

            // Delete email verification document
            await OtpModel.deleteMany({ userId: existingUser._id });
            res.redirect('/login')


        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, message: "Unable to verify email, please try again later" });
        }

    }

    // login Users
    async createLogin(req, res) {
        try {
            const { password, email } = req.body;
            if (!email || !password) {
                req.flash('error', 'Email and password are required')
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
            }

            const user = await UserModel.findOne({ email });
            if (!user || !(await ComparePassword(password, user.password))) {
                req.flash('error', 'Invalid email or password')
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            let jwtSecret;
            let cookieName;
            let redirectUrl = '/login';

            if (user.role === 'admin') {
                jwtSecret = process.env.JWT_SECRET_ADMIN || "hellowelcomeAdmin123456";
                cookieName = 'adminToken';
                redirectUrl = '/admin/dashboard';
            } else if (user.role === 'user') {
                jwtSecret = process.env.JWT_SECRET || "hellowelcometowebskittersacademy123456";
                cookieName = 'userToken';
                redirectUrl = 'http://localhost:3000'; // Frontend URL
            } else if (user.role === 'manager') {
                jwtSecret = process.env.JWT_SECRET_MANAGER || "hellowelcomeManager123456";
                cookieName = 'managerToken';
                redirectUrl = '/manager/dashboard';
            } else if (user.role === 'technician') {
                jwtSecret = process.env.JWT_SECRET_EMPLOYEE || "hellowelcomeEmployee123456";
                cookieName = 'employeeToken';
                redirectUrl = '/technician/dashboard';
                const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
                res.cookie(cookieName, token, { httpOnly: true });
                return res.redirect(redirectUrl);
            } else {
                req.flash('error', 'User role not found')
                return res.status(404).json({
                    success: false,
                    message: 'User role not found'
                });
            }

            if (!jwtSecret) {
                req.flash('error', 'JWT secret not found')
                return res.status(500).json({
                    success: false,
                    message: 'JWT secret not found'
                });
            }

            const token = jwt.sign({
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                area: user.area
            }, jwtSecret, { expiresIn: '60m' });

            // Set cookie
            res.cookie(cookieName, token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });

            req.flash('success', 'Login successful!')
            // Return JSON response instead of redirecting
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    area: user.area
                },
                redirectUrl: redirectUrl,
                role: user.role,
                token: token
            });

        } catch (error) {
            console.error('Login error:', error);
            req.flash('error', 'Internal server error')
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    async logoutUser(req, res) {
        try {
            res.clearCookie('userToken')
            res.redirect('http://localhost:3000')
            return res.status(StatusCode.CREATED).json({
                message: "User Logout Successfully!"
            })
        } catch (error) {
            console.log(error);

        }
    }


    // Create a new feedback
    async createFeedback(req, res) {
        try {
            const { userId, bookingId, feedback, rating } = req.body;
            const newFeedback = new Feedback({
                userId,
                bookingId,
                feedback,
                rating,
            });
            await newFeedback.save();
            res.status(201).json({ message: 'Feedback created successfully', feedback: newFeedback });
        } catch (error) {
            res.status(500).json({ message: 'Error creating feedback', error });
        }
    };


    async getFeedBack(req, res) {
        try {
            const feedbacks = await Feedback.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $lookup: {
                        from: 'bookings',
                        localField: 'bookingId',
                        foreignField: '_id',
                        as: 'bookingDetails'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        feedback: 1,
                        rating: 1,
                        userDetails: { $arrayElemAt: ['$userDetails', 0] },
                        bookingDetails: { $arrayElemAt: ['$bookingDetails', 0] }
                    }
                }
            ]);
            res.status(200).json(feedbacks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching feedbacks' });
        }
    }


}
module.exports = new UserController