const express = require('express')
const UserModel = require('../model/userModel')
const BookingModel = require('../model/bookingModel')
class EjsController {


    // admindashboard
    async adminDashboard(req, res) {
        const technicians = await UserModel.find({ role: 'technician' });
        const manager = await UserModel.find({ role: 'manager' });
        const user = await UserModel.find({ role: 'user' });
        const booking = await BookingModel.find()
        return res.render('adminDashboard', {
            title: "Admin_dashboard",
            success: req.flash('success'),
            error: req.flash('error'),
            technicians: technicians.length,
            manager: manager.length,
            user: user.length,
            booking: booking.length
        })
    }

    // manager dashboard

    async managerDashboard(req, res) {
        const technicians = await UserModel.find({ role: 'technician' });
        const manager = await UserModel.find({ role: 'manager' });
        const user = await UserModel.find({ role: 'user' });
        const booking = await BookingModel.find()
        return res.render('managerDashboard', {
            title: "Manager_dashboard",
            success: req.flash('success'),
            error: req.flash('error'),
            technicians: technicians.length,
            manager: manager.length,
            user: user.length,
            booking: booking.length
        })
    }

    // employee dashboard
    async employeeDashboard(req, res) {
        const technicians = await UserModel.find({ role: 'technician' });
        const manager = await UserModel.find({ role: 'manager' });
        const user = await UserModel.find({ role: 'user' });
        const booking = await BookingModel.find()
        return res.render('employeeDashboard', {
            title: "Technician_dashboard",
            success: req.flash('success'),
            error: req.flash('error'),
            technicians: technicians.length,
            manager: manager.length,
            user: user.length,
            booking: booking.length
        })
    }

    // admin create manager
    async createManager(req, res) {
        return res.render('createManager', {
            title: "create_manager",
            success: req.flash('success'),
            error: req.flash('error')
        })
    }

    // employee create
    async createEmployee(req, res) {
        return res.render('createEmployee', {
            title: "create_employee",
            success: req.flash('success'),
            error: req.flash('error')
        })
    }

    // promote employee page
    async promotePage(req, res) {
        const technicians = await UserModel.find({ role: 'technician' });
        return res.render('promoteEmployee', {
            title: "Promote_Employee",
            user: technicians,
            success: req.flash('success'),
            error: req.flash('error'),
            techniciansCount: technicians.length
        });
    }

    // service page
    async service(req, res) {
        return res.render('service', {
            title: "service",
            success: req.flash('success'),
            error: req.flash('error')
        })
    }

    // login page
    async login(req, res) {
        res.render('login', {
            title: 'login',
            success: req.flash('success'),
            error: req.flash('error')
        })
    }
}
module.exports = new EjsController