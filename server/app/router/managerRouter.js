const express = require('express')
const ManagerController = require('../controllers/ManagerController')
const ManagerAuthCheck = require('../middleware/ManagerAuthCheck')
const route = express.Router();

route.post('/create/technician', ManagerAuthCheck, ManagerController.checkAuthManager, ManagerController.createTechnician)
route.get('/manager/view/booking', ManagerAuthCheck, ManagerController.checkAuthManager, ManagerController.getBooking)
route.get('/logout/manager', ManagerController.logoutManager)
route.post('/assign-task',ManagerAuthCheck, ManagerController.assignTask);
route.get('/manager/employee/view',ManagerAuthCheck,ManagerController.viewEmployee)
route.get('/manager/employee/delete/:id',ManagerAuthCheck,ManagerController.deleteEmployee)
module.exports = route