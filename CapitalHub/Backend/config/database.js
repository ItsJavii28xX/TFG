// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const caBase64 = process.env.DB_CA;
if (!caBase64) {
  throw new Error('La variable de entorno DB_CA (contenido del certificado) no está definida');
}

const ca = Buffer.from(caBase64, 'base64');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: false,
    dialectOptions: {
      ssl: {
        ca
      }
    }
  }
);

module.exports = sequelize;
