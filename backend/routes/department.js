const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Department = require("../models/department");
const Employees = require("../models/employees");
const { check, validationResult } = require("express-validator");
const departmentNames = [
  "General Dentistry",
  "Pediatric Dentistry",
  "Restorative Dentistry",
  "Surgery",
  "Orthodontics",
];

//
router.get("/", async (req, res) => {
  try {
    const departments = await Department.find().select({
      employees: 0,
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    });
    return res.status(200).json(departments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// criar uma chamada get para obter todas as informações de um departamento

router.get("/:id", async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate({
        path: "employees",
        select: "-__v -createdAt -updatedAt -departmentId",
      })
      .select("-__v -createdAt -updatedAt");
    return res.status(200).json(department);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// rota para criar um novo departamento

router.post(
  "/",
  [
    check("name").notEmpty().withMessage("Name is required"),
    check("description").notEmpty().withMessage("Description is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    try {
      // Verifica se o funcionário já existe
      const checkDepartment = await Department.findOne({ name });
      if (checkDepartment) {
        return res.status(409).json({ message: "Department already exists" });
      }

      const department = new Department({ name, description });
      await department.save();

      const responseDepartment = {
        _id: department._id,
        name: department.name,
        description: department.description,
      };

      res
        .status(201)
        .json({
          message: "Department created",
          department: responseDepartment,
        });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
);

// criar uma chamada put para atualizar um departamento

router.put("/:id", async (req, res) => {
  const departmentId = req.params.id;
  const { name, description } = req.body;

  if (!name && !description) {
    return res.status(400).json({ message: "Nothing to update" });
  }

  try {
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Cannot find department" });
    }

    if (name) {
      const checkDepartment = await Department.findOne({ name });
      if (checkDepartment) {
        return res
          .status(409)
          .json({ message: "Department name already exists" });
      }
    }
    const payload = { name, description };
    const updatedObj = {};

    for (const [key, value] of Object.entries(payload)) {
      if (value !== undefined) {
        updatedObj[key] = value;
      }
    }

    await Department.updateOne({ _id: departmentId }, updatedObj);
    res.json({ message: "Department updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// criar uma chamada delete para remover um departamento

router.delete("/:id", async (req, res) => {
  try {
    const departmentId = req.params.id;
    const deleteDepartment = await Department.deleteOne({ _id: departmentId });
    if (deleteDepartment.deletedCount === 0) {
      return res.status(404).json({ message: "Cannot find department" });
    }
    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
