const mongoose = require("mongoose");
const { Schema } = mongoose;

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
    },
  },
  {
    timestamps: true,
  }
);
const Employee = mongoose.model("Employees", employeeSchema);

module.exports = Employee;
