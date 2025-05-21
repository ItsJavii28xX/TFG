const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const swaggerSetup = require('./swagger');
require('dotenv').config();

const sequelize = require('./config/database');

const app = express();

app.use(cors({
  origin: ['http://localhost:4200', 'https://capitalhub-frontend.vercel.app']
}));
app.use(express.json());

swaggerSetup(app);

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'CapitalHub Backend up!' });
});

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
    console.log('DB connected');
    if (process.env.NODE_ENV !== 'production') {
      return sequelize.sync({ alter: true })
        .then(() => console.log('Models synced'));
    }
  })
  .catch(err => console.error('DB error', err));


if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
