const mongoose = require('mongoose');
const{ Schema } = mongoose;

const employeeSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        surname:{
            type: String,
            required: true,
        },
        department:{
            type: Schema.Types.ObjectId,
            ref: 'Department',
        },
    },
    {
        timestamps: true, 
    }
);
const Employees = mongoose.model('Employees', employeeSchema);

module.exports = Employees;
