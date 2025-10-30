const UserModel = require('../model/userModel')
const { userValidation } = require('../helper/validation')
// const OtpEmailVerify = require('../helper/OtpEmailVerify');
const ConfirmationEmail = require('../helper/EmailVerify')
const { HashedPassword, RandomPassword } = require('../helper/HashedPassword')
const BookingModel = require('../model/bookingModel')
class ManagerController {

    async checkAuthManager(req, res, next) {
        try {
            if (req.manager) {
                next()
            } else {
                res.redirect('/login/user')
            }

        } catch (error) {
            console.log(error);

        }

    }


    // create technician
    async createTechnician(req, res) {
        try {
            const { error } = userValidation().validate(req.body);
            if (error) {
                req.flash('error', error.message);
                return res.redirect('/employee/create');
            }

            const { name, email, password, area, phone } = req.body;
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                req.flash('error', 'Email already exists.');
                return res.redirect('/employee/create');
            }

            const hashedPassword = await HashedPassword(password);
            const technician = new UserModel({
                name,
                email,
                password: hashedPassword,
                role: 'technician',
                area,
                is_verified: true,
                phone,
            });
            const savedTechnician = await technician.save();

            // console.log('Attempting to send email to:', email);
            const emailSent = await ConfirmationEmail(email, password, name);
            if (emailSent) {
                req.flash('success', 'Technician created successfully! Confirmation email sent.');
            } else {
                req.flash('warning', 'Technician created but confirmation email failed to send.');
            }

            return res.redirect('/employee/create');
        } catch (error) {
            // console.error('Error creating technician:', error);
            req.flash('error', 'Error creating technician account');
            return res.redirect('/employee/create');
        }
    }

    // logout manager
    async logoutManager(req, res) {
        try {
            res.clearCookie('managerToken')
            res.redirect('http://localhost:3000')

        } catch (error) {
            console.log(error);

        }
    }

    // booking view
    async getBooking(req, res) {
        try {
            const technicians = await UserModel.find({ role: 'technician' });
            const allBooking = await BookingModel.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $unwind: '$userDetails'
                },
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
            ])
            const users = await UserModel.find();
            res.render('managerViewBooking', {
                title:"Booking_view",
                message: "data get successfully",
                booking: allBooking,
                technicians: technicians,
                user: users,
                success: req.flash('success'),
                error: req.flash('error'),
                bookingCount: allBooking.length
            });
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    // Assign servicing tasks to employees based on area
    async assignTask(req, res) {
        try {
            const { bookingId, technicianId } = req.body;
            const managerId = req.manager._id; // assuming you have the manager's ID in the request

            // Find the booking
            const booking = await BookingModel.findById(bookingId);
            if (!booking) {
                req.flash('error', 'Booking not found');
                return res.redirect('/manager/view/booking');
            }

            // Find the technician
            const technician = await UserModel.findById(technicianId);
            if (!technician) {
                req.flash('error', 'Technician not found');
                return res.redirect('/manager/view/booking');
            }

            // Check if technician is assigned to the same area as the booking
            if (technician.area !== booking.address) {
                req.flash('error', 'Technician not assigned to this area');
                return res.redirect('/manager/view/booking');
            }

            // Assign the task to the technician
            booking.assignedTo = technicianId;
            booking.assignedBy = managerId;
            booking.status = 'assigned';
            await booking.save();

            req.flash('success', 'Task assigned successfully');
            res.redirect('/manager/view/booking');
        } catch (error) {
            console.log(error);
            req.flash('error', 'Server error');
            res.redirect('/manager/view/booking');
        }
    }

    // employee view
    async viewEmployee(req, res) {
        const technicians = await UserModel.find({ role: 'technician' });
        return res.render('managerEmployeeView', {
            title: "Employees",
            success: req.flash('success'),
            error: req.flash('error'),
            technicians: technicians,
            techniciansCount: technicians.length
        })
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
                    res.redirect('/manager/employee/view')
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
}

module.exports = new ManagerController()