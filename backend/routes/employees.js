const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const Employee = require("../models/employees");
const Department = require("../models/department");
const department = require("../models/department");

// Rota para listar todos os funcionários
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find(
      {},
      "name surname department createdAt updatedAt"
    ).populate("department", "name -_id"); // Popula apenas o nome do departamento

    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Rota para listar um funcionário específico
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("department", "name -_id")
      .select("name surname department");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// rota para cadastrar um novo funcionário
router.post(
  "/",
  [
    check("name").notEmpty().withMessage("Name is required"),
    check("surname").notEmpty().withMessage("Surname is required"),
    check("departmentId").notEmpty().withMessage("Department name is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, surname, departmentId } = req.body;

    try {
      // Verifica se o departamento existe
      const department = await Department.findById(departmentId);
      if (!department) {
        return res.status(400).json({ message: "Department not found" });
      }

      // Verifica se o funcionário já existe
      const checkEmployee = await Employee.findOne({ name, surname });
      if (checkEmployee) {
        return res.status(409).json({ message: "Employee already exists" });
      }

      const employee = new Employee({
        name,
        surname,
        departmentId: department._id,
      });
      const newEmployee = await employee.save();

      await Department.updateOne(
        { _id: department._id },
        { $push: { employees: newEmployee._id } }
      );

      res.status(201).json({ message: "Employee created" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
);

// chamada put para atualizar um funcionário
router.put("/:id", async (req, res) => {
  const employeeId = req.params.id;
  const { name, surname, departmentId } = req.body;

  if (!name && !surname && !departmentId) {
    return res.status(400).json({ message: "Nothing to update" });
  }

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Cannot find employee" });
    }

    const newName = name ?? employee.name;
    const newSurname = surname ?? employee.surname;
    const newDepartmentId = departmentId ?? employee.departmentId;

    if (name || surname) {
      const checkEmployee = await Employee.findOne({
        name: newName,
        surname: newSurname,
      });
      if (checkEmployee) {
        return res.status(409).json({ message: "Employee already exists" });
      }
    }

    if (departmentId) {
      // Verifica se o departamento existe
      const department = await Department.findById(departmentId);
      if (!department) {
        return res.status(400).json({ message: "Department not found" });
      }
    }

    const payload = {
      name: newName,
      surname: newSurname,
      departmentId: newDepartmentId,
    };
    const updatedObj = {};

    for (const [key, value] of Object.entries(payload)) {
      if (value !== undefined) {
        updatedObj[key] = value;
      }
    }

    await Employee.updateOne({ _id: employeeId }, updatedObj);
    res.json({ message: "Employee updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// chamada delete para remover um funcionário
router.delete("/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const deleteEmployee = await Employee.deleteOne({ _id: employeeId });
    if (deleteEmployee.deletedCount === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
