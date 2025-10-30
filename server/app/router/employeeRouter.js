const express=require('express')
const route=express.Router();
const EmployeeController=require('../controllers/employeeController')
const employeeAuthCheck=require('../middleware/EmployeeAuthCheck')

route.get('/employee/booking',EmployeeController.getBooking)
route.get('/employee/logout',EmployeeController.logoutEmployee)
route.post('/employee/update-booking-status',employeeAuthCheck,EmployeeController.updateBookingStatus)
module.exports=route