const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const Employees = require('../models/employees');
const Department = require('../models/department');
const department = require('../models/department');

router.post('/', [
  check('name').notEmpty().withMessage('Name is required'),
  check('surname').notEmpty().withMessage('Surname is required'),
  check('departmentName').notEmpty().withMessage('Department name is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, surname, departmentName } = req.body;

  try {
    // Verifica se o departamento existe
    const department = await Department.findOne({ name: departmentName });
    if (!department) {
      return res.status(400).json({ message: 'Department not found' });
    }

    // Verifica se o funcionário já existe
    const checkEmployee = await Employees.findOne({ name, surname });
    if (checkEmployee) {
      return res.status(409).json({ message: 'Employee already exists' });
    }

    const employee = new Employees({ name, surname, department: department._id });
    const newEmployee = await employee.save();

    await Department.updateOne(
      { _id: department._id },
      { $push: { employees: newEmployee._id } }
    );
    
    res.status(201).json({ message: 'Employee created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Rota para listar todos os funcionários
router.get('/', async (req, res) => {
  try {
    const employees = await Employees.find({}, 'name surname department createdAt updatedAt')
      .populate('department', 'name -_id'); // Popula apenas o nome do departamento

    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
