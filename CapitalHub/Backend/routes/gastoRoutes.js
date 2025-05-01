const express = require('express');
const router = express.Router();
const gastoController = require('../controllers/gastoController');
const auth = require('../middleware/auth');

router.get('/grupos/:idGrupo/gastos', auth, gastoController.obtenerGastosDeGrupo);
router.get('/gastos/:id', auth, gastoController.obtenerGastoPorId);

router.post('/grupos/:idGrupo/gastos', auth, gastoController.crearGasto);

router.put('/gastos/:id', auth, gastoController.actualizarGasto);

router.delete('/gastos/:id', auth, gastoController.eliminarGasto);

module.exports = router;
