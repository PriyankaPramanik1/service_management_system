
const BookingModel = require('../model/bookingModel');
class BookingController {
    // create booking
    async createBooking(req, res) {
        try {
            console.log('user:', req.user);
            console.log('body:', req.body);
            console.log('file:', req.file ? 'File received' : 'No file');

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Please upload a booking image',
                });
            }

            const { applianceType, serviceType, preferredDate, problemDescription, address, phone } = req.body;

            if (!applianceType || !serviceType || !preferredDate || !problemDescription || !address || !phone) {
                return res.status(400).json({
                    success: false,
                    message: 'Please fill all required fields',
                });
            }

            // Enhanced user check with debugging
            if (!req.user) {
                console.log('No req.user found');
                return res.status(401).json({
                    success: false,
                    message: 'You must be logged in to create a booking',
                });
            }

            console.log('user structure:', JSON.stringify(req.user, null, 2));

            // Check different possible ID fields
            const userId = req.user._id || req.user.id || req.user.userId || req.user.userID;

            if (!userId) {
                console.log('No user ID found in req.user');
                return res.status(401).json({
                    success: false,
                    message: 'User authentication failed - no user ID found',
                });
            }

            console.log('✅ Using user ID:', userId);

            const createNewBooking = new BookingModel({
                applianceType,
                serviceType,
                preferredDate,
                problemDescription,
                address,
                phone,
                userId: userId,
                bookingImage: req.file.path,
            });

            const savedBooking = await createNewBooking.save();

            return res.status(201).json({
                success: true,
                message: 'Booking created successfully!',
                data: savedBooking,
            });
        } catch (error) {
            console.error(' Error creating booking:', error);
            return res.status(500).json({
                success: false,
                message: 'Error creating booking',
                error: error.message,
            });
        }
    }

    // get booking
    async getBooking(req, res) {
        try {
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
            return res.status(200).json(allBooking);
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    // cancel booking
    async cancelBooking(req, res) {
        try {
            const { bookingId } = req.body;

            // Input validation
            if (!bookingId) {
                return res.status(400).json({
                    success: false,
                    message: 'Booking ID is required',
                });
            }

            // Validate bookingId format (mongoose ObjectId)
            if (!mongoose.Types.ObjectId.isValid(bookingId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid booking ID format',
                });
            }

            // User authentication check
            if (!req.user || !req.user._id) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required. Please log in to cancel bookings.',
                });
            }

            const userId = req.user._id;

            // Find the booking
            const booking = await BookingModel.findOne({ _id: bookingId, userId: userId });
            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found or you do not have permission to cancel it',
                });
            }

            // Enhanced status validation based on your schema enum
            const nonCancelableStatuses = ['completed', 'cancel'];
            if (nonCancelableStatuses.includes(booking.status)) {
                return res.status(400).json({
                    success: false,
                    message: `Booking cannot be canceled as it is already ${booking.status}`,
                    currentStatus: booking.status
                });
            }

            // Check if booking is already assigned to a technician
            if (booking.status === 'assigned') {
                return res.status(400).json({
                    success: false,
                    message: 'Booking cannot be canceled as it has already been assigned to a technician. Please contact support.',
                });
            }

            // Update booking status to 'cancel' (matching your schema enum)
            booking.status = 'cancel';
            const updatedBooking = await booking.save();

            return res.status(200).json({
                success: true,
                message: 'Booking canceled successfully!',
                data: {
                    id: updatedBooking._id,
                    applianceType: updatedBooking.applianceType,
                    serviceType: updatedBooking.serviceType,
                    status: updatedBooking.status,
                    canceledAt: updatedBooking.updatedAt,
                    preferredDate: updatedBooking.preferredDate
                },
            });
        } catch (error) {
            console.error('Error canceling booking:', error);

            // Handle specific MongoDB errors
            if (error.name === 'CastError') {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid booking ID format',
                });
            }

            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Internal server error while canceling booking',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            });
        }
    }

}
module.exports = new BookingController();