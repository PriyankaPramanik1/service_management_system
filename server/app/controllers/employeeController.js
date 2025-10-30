const UserModel = require('../model/userModel')
const BookingModel = require('../model/bookingModel')
class EmployeeController {
    async checkAuthEmployee(req, res, next) {
        try {
            if (req.employee) {
                next()
            } else {
                res.redirect('/login/user')
            }
        } catch (error) {
            console.log(error);
        }
    }

    // employee logout
    
    async logoutEmployee(req, res) {
        try {
            res.clearCookie('employeeToken')
            return res.redirect('http://localhost:3000')

        } catch (error) {
            req.flash('error', 'Error occours!');
            // console.log(error);
        }
    }

    // view bookings
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
            res.render('employeeViewBooking', {
                title:"emp_bookingView",
                message: "Data retrieved successfully",
                booking: allBookings,
                users,
                bookingsCount: allBookings.length,
                success: req.flash('success'),
                error: req.flash('error'),
            });
        } catch (error) {
            // console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }

    // change status
    async updateBookingStatus(req, res) {
        console.log(req.body);
        try {
            const { bookingId, status } = req.body;
            const employeeId = req.employee.id;
            const validStatuses = ['pending', 'assigned', 'completed', 'cancel', 'in progress'];
            if (!validStatuses.includes(status.toLowerCase())) {
                req.flash('error', 'Invalid status value');
                return res.redirect('/employee/booking');
            }
            const booking = await BookingModel.findById(bookingId);
            if (!booking) {
                req.flash('error', 'Booking not found');
                return res.redirect('/employee/booking');
            }
            if (booking.assignedTo.toString() !== employeeId.toString()) {
                req.flash('error', 'You are not assigned to this booking');
                return res.redirect('/employee/booking');
            }
            booking.status = status.toLowerCase();
            await booking.save();
            req.flash('success', 'Booking status updated successfully');
            res.redirect('/employee/booking');
        } catch (error) {
            console.log(error);
            req.flash('error', 'Server error');
            res.redirect('/employee/booking');
        }
    }



}
module.exports = new EmployeeController()