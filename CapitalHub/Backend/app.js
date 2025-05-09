const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', require('./routes/usuarioRoutes'));
app.use('/api', require('./routes/grupoRoutes'));
app.use('/api', require('./routes/usuariogrupoRoutes'));
app.use('/app', require('./routes/presupuestoRoutes'));
app.use('/api', require('./routes/gastoRoutes'));
app.use('/api', require('./routes/categoriaRoutes'));
app.use('/api', require('./routes/alertalimiteRoutes'));
app.use('/api', require('./routes/contactoRoutes'));
app.use('/api', require('./routes/historicoRoutes'));

sequelize.authenticate()
  .then(() => {
    console.log('✅ DB connected');
    if (process.env.NODE_ENV !== 'production') {
      return sequelize.sync({ alter: true })
        .then(() => console.log('✅ Models synced'));
    }
  })
  .catch(err => console.error('❌ DB error', err));


module.exports = serverless(app);
