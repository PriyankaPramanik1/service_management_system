const express = require('express')
const UserController = require('../controllers/UserController')
const router = express.Router();


router.post('/create/user', UserController.createUser)
router.post('/verify/form', UserController.verify)
router.post('/login/user', UserController.createLogin)
router.delete('/user/logout', UserController.logoutUser)
router.post('/feedback', UserController.createFeedback)
router.get('/get/feedback', UserController.getFeedBack)
module.exports = router

