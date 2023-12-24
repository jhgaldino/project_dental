const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Department = require('../models/department');
const Employees = require('../models/employees');
const departmentNames = ['General Dentistry', 'Pediatric Dentistry', 'Restorative Dentistry', 'Surgery', 'Orthodontics'];

departmentNames.forEach(async (name) => {
    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
        console.log(`Department ${name} already exists`);
        return;
    }

    const department = new Department({ name });

    try {
        const newDepartment = await department.save();
        console.log(`Department ${name} created`);
    } catch (err) {
        console.log(`Error creating department ${name}: ${err.message}`);
    }
});

router.get('/', async (req, res) => {
    try {
        const departments = await Department.find().populate('employees');
        return res.status(200).json(departments);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

async function getDepartment(req, res, next) {
    let department;
    try {
        department = await Department.findById(req.params.id);
        if (department == null) {
            return res.status(404).json({ message: 'Cannot find department' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.department = department;
    next();
}

module.exports = router;