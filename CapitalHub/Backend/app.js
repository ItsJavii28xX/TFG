const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/grupos', require('./routes/grupoRoutes'));
app.use('/api/usuariogrupo', require('./routes/usuariogrupoRoutes'));
app.use('/api/presupuestos', require('./routes/presupuestoRoutes'));
app.use('/api/gastos', require('./routes/gastoRoutes'));
app.use('/api/categorias', require('./routes/categoriaRoutes'));
app.use('/api/alertalimite', require('./routes/alertalimiteRoutes'));
app.use('/api/contactos', require('./routes/contactoRoutes'));
app.use('/api/historico', require('./routes/historicoRoutes'));

sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a MySQL establecida correctamente.');
    return sequelize.sync({ alter: true });
  })
  .then(() => console.log('✅ Modelos sincronizados correctamente.'))
  .catch(err => console.error('❌ Error al conectar DB:', err));

module.exports.handler = serverless(app);
