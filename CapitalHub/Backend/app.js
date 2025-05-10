const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());

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
  res.json({ ok: true, message: 'Backend activo' });
});

// No incluyas ninguna ruta adicional por ahora
module.exports = serverless(app);
