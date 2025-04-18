const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importar y usar las rutas
app.use('/api', require('./routes/usuarioRoutes'));
app.use('/api', require('./routes/grupoRoutes'));
app.use('/api', require('./routes/usuariogrupoRoutes'));
app.use('/api', require('./routes/presupuestoRoutes'));
app.use('/api', require('./routes/gastoRoutes'));
app.use('/api', require('./routes/categoriaRoutes'));
app.use('/api', require('./routes/contactoRoutes'));
app.use('/api', require('./routes/alertalimiteRoutes'));
app.use('/api', require('./routes/historicoRoutes'));

// Probar conexión y sincronizar modelos con Sequelize
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a MySQL establecida correctamente.');

    return sequelize.sync({ alter: true }); // Usa alter para no perder datos
  })
  .then(() => {
    console.log('✅ Modelos sincronizados correctamente.');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar o sincronizar:', err);
  });