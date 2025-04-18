const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Ruta del certificado 'ca.pem' en el mismo directorio actual ('config')
const certPath = path.join(__dirname, 'ca.pem');
const cert = fs.readFileSync(certPath, 'utf-8');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        ca: cert
      }
    }
  }
);

module.exports = sequelize;