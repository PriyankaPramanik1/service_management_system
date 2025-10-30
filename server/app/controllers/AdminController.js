const UserModel = require('../model/userModel')
const { userValidation } = require('../helper/validation')
const ConfirmationEmail = require('../helper/EmailVerify')
const { HashedPassword } = require('../helper/HashedPassword')
const ComparePassword = require('../helper/ComparePassword')
const BookingModel = require('../model/bookingModel')
const jwt = require('jsonwebtoken')
class AdminController {

    async checkAuthAdmin(req, res, next) {
        try {
            if (req.admin) {
                next()
            } else {
                res.redirect('/login/user')
            }

        } catch (error) {
            console.log(error);

        }

    }

    // logout Admin
    async logoutAdmin(req, res) {
        try {
            res.clearCookie('adminToken')
            return res.redirect('http://localhost:3000')

        } catch (error) {
            req.flash('error', 'Error occours!');
            // console.log(error);
        }
    }
    // create managers
    async createManager(req, res) {
        try {
            // Validate input
            const { error } = userValidation().validate(req.body);
            if (error) {
                req.flash('error', error.message);
                return res.redirect('/manager/create');
            }

            const { name, email, password, area, phone } = req.body;

            // Check for existing user
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                req.flash('error', 'Email already exists.');
                return res.redirect('/manager/create');
            }

            // Hash password and create user
            const hashedPassword = await HashedPassword(password);
            const manager = new UserModel({
                name,
                email,
                password: hashedPassword,
                role: 'manager',
                area,
                is_verified: true,
                phone
            });

            const savedManager = await manager.save();

            // Send confirmation email
            console.log('Attempting to send email to:', email);
            const emailSent = await ConfirmationEmail(email, password, name);

            if (emailSent) {
                req.flash('success', 'Manager created successfully! Confirmation email sent.');
            } else {
                req.flash('warning', 'Manager created but confirmation email failed to send.');
            }

            return res.redirect('/manager/create');

        } catch (error) {
            // console.error('Error creating manager:', error);
            req.flash('error', 'Error creating manager account');
            return res.redirect('/manager/create');
        }
    }

    // promote employee
    async promoteToManager(req, res) {
        try {
            const { id } = req.params;
            const user = await UserModel.findById(id);
            if (!user) {
                req.flash('error', 'User not found.');
                return res.redirect('/promote-page');
            }
            user.role = 'manager';
            await user.save();
            req.flash('success', 'User promoted to manager successfully.');
            return res.redirect('/promote/employee');
        } catch (error) {
            // console.error(error);
            req.flash('error', 'Error promoting user to manager.');
            return res.redirect('/promote/employee');
        }
    }

    // booking view
    async getBooking(req, res) {
        try {
            const allBookings = await BookingModel.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                { $unwind: '$userDetails' },
                {
                    $project: {
                        name: '$userDetails.name',
                        email: '$userDetails.email',
                        phone: '$userDetails.phone',
                        userId: 1,
                        address: 1,
                        applianceType: 1,
                        serviceType: 1,
                        preferredDate: 1,
                        bookingImage: 1,
                        problemDescription: 1,
                        status: 1,
                        assignedTo: 1,
                        assignedBy: 1,
                        createdAt: 1
                    }
                }
            ]);

            const users = await UserModel.find();
            // console.log(users);
            res.render('adminViewBooking', {
                title:"Booking_view",
                message: "Data retrieved successfully",
                booking: allBookings,
                users,
                bookingsCount: allBookings.length
            });
        } catch (error) {
            // console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }


    // employee view
    async viewEmployee(req, res) {
        const technicians = await UserModel.find({ role: 'technician' });
        return res.render('adminEmployeeView', {
            title: "Employees",
            success: req.flash('success'),
            error: req.flash('error'),
            technicians: technicians,
            techniciansCount: technicians.length
        })
    }


    // manager view
    async viewManager(req, res) {
        const manager = await UserModel.find({ role: 'manager' });
        return res.render('adminManagerView', {
            title: "Managers",
            success: req.flash('success'),
            error: req.flash('error'),
            manager: manager,
            managersCount: manager.length
        })
    }

    // Delete manager
    async deleteManager(req, res) {
        // console.log(req.body);

        try {
            const id = req.params.id;

            // Delete the manager from database
            const data = await UserModel.findByIdAndDelete(id);
            req.flash('success', 'Data deleted successfully!')
            if (data) {
                res.redirect('/view/manager')
            }
        } catch (error) {
            // console.log(error);
            req.flash('error', 'Failed to delete.')
            // return res.status(500).json({
            //     success: false,
            //     message: "Failed to delete.",
            //     error: error.message
            // });
        }
    }

    // delete employee
    async deleteEmployee(req, res) {
        // console.log(req.body);

        try {
            const id = req.params.id;

            // Delete the manager from database
            const data = await UserModel.findByIdAndDelete(id);
            req.flash('success', 'Data deleted successfully!')
            if (data) {
                res.redirect('/view/employee')
            }

        } catch (error) {
            req.flash('error', 'Failed to delete.')
            // return res.status(500).json({
            //     success: false,
            //     message: "Failed to delete.",
            //     error: error.message
            // });
        }
    }


    async staff_Login(req, res) {
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
            let cookieName = "";
            let redirectUrl = "";

            if (user.role === 'admin') {
                jwtSecret = process.env.JWT_SECRET_ADMIN || "hellowelcomeAdmin123456";
                cookieName = 'adminToken';
                redirectUrl = '/admin/dashboard';
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
            // return res.status(200).json({
            //     success: true,
            //     message: 'Login successful',
            //     user: {
            //         id: user._id,
            //         name: user.name,
            //         email: user.email,
            //         phone: user.phone,
            //         role: user.role,
            //         area: user.area
            //     },
            //     redirectUrl: redirectUrl,
            //     role: user.role,
            //     token: token
            // });
            return res.redirect(redirectUrl);
        } catch (error) {
            console.error('Login error:', error);
            req.flash('error', 'Internal server error')
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

}


module.exports = new AdminController()