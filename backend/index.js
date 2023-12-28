const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const router = require("./routes/department");
const cors = require("cors");

const app = express();

connectDB();
const port = process.env.NODE_LOCAL_PORT || 3000;

// Middleware para analisar JSON e URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para permitir CORS
app.use(cors());

// Rota Raiz
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Monta as rotas de funcionários e departamentos
app.use("/api/employees", require("./routes/employees")); // Modificado para '/api/employees'
app.use("/api/departments", require("./routes/department")); // Modificado para '/api/department'

// Inicialização do Servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
