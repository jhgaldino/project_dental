const mongoose = require('mongoose');
const { Schema } = mongoose;

const departmentSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        employees: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Employees',
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Department', departmentSchema);
