const mongoose = require('mongoose');
const connectDb = require('../config/db'); // Substitua pelo caminho correto do seu arquivo db.js
const Department = require('../models/department');
const url = 'mongodb://localhost:27017/dentist-db';

const departmentNames = ['General Dentistry', 'Pediatric Dentistry', 'Restorative Dentistry', 'Surgery', 'Orthodontics'];

async function populateDepartments() {
  try {
    // Conectando ao banco de dados usando a função importada
    await connectDb();

    for (const name of departmentNames) {
      // Verificar se o departamento já existe
      const existingDepartment = await Department.findOne({ name });
      if (existingDepartment) {
        console.log(`Department ${name} already exists`);
        continue;
      }

      // Criar um novo departamento
      const department = new Department({ name });
      await department.save();
      console.log(`Department ${name} created`);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
  } finally {
    // Fechando a conexão com o banco de dados
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

populateDepartments();
