const express = require('express');
const router = express.Router();
const gastoController = require('../controllers/gastoController');

router.get('/grupos/:idGrupo/gastos', gastoController.obtenerGastosDeGrupo);
router.post('/grupos/:idGrupo/gastos', gastoController.crearGasto);
router.get('/gastos/:id', gastoController.obtenerGastoPorId);
router.put('/gastos/:id', gastoController.actualizarGasto);
router.delete('/gastos/:id', gastoController.eliminarGasto);

module.exports = router;
