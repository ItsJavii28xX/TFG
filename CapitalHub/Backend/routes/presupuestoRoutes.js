const express = require('express');
const router = express.Router();
const presupuestoController = require('../controllers/presupuestoController');

router.get('/grupos/:idGrupo/presupuestos', presupuestoController.obtenerPresupuestosDeGrupo);
router.post('/grupos/:idGrupo/presupuestos', presupuestoController.crearPresupuesto);
router.get('/presupuestos/:id', presupuestoController.obtenerPresupuestoPorId);
router.put('/presupuestos/:id', presupuestoController.actualizarPresupuesto);
router.delete('/presupuestos/:id', presupuestoController.eliminarPresupuesto);

module.exports = router;
