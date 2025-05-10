const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());

// Mantén una sola conexión establecida y reutilízala
let isConnected = false;

async function connectToDatabase() {
  if (!isConnected) {
    try {
      await sequelize.authenticate();
      console.log('✅ DB connected');
      isConnected = true;
    } catch (err) {
      console.error('❌ DB error:', err);
      throw err;
    }
  }
}

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    res.status(500).json({ ok: false, message: 'DB Connection error' });
  }
});

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'CapitalHub Backend up!' });
});

// Rutas
app.use('/api', require('./routes/usuarioRoutes'));
app.use('/api', require('./routes/grupoRoutes'));
app.use('/api', require('./routes/usuariogrupoRoutes'));
app.use('/app', require('./routes/presupuestoRoutes'));
app.use('/api', require('./routes/gastoRoutes'));
app.use('/api', require('./routes/categoriaRoutes'));
app.use('/api', require('./routes/alertalimiteRoutes'));
app.use('/api', require('./routes/contactoRoutes'));
app.use('/api', require('./routes/historicoRoutes'));

module.exports = serverless(app);