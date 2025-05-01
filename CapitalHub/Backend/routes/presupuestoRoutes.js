const express = require('express');
const router = express.Router();
const presupuestoController = require('../controllers/presupuestoController');
const auth = require('../middleware/auth');

router.get('/grupos/:idGrupo/presupuestos', auth, presupuestoController.obtenerPresupuestosDeGrupo);
router.get('/presupuestos/:id', auth, presupuestoController.obtenerPresupuestoPorId);

router.post('/grupos/:idGrupo/presupuestos', auth, presupuestoController.crearPresupuesto);

router.put('/presupuestos/:id', auth, presupuestoController.actualizarPresupuesto);

router.delete('/presupuestos/:id', auth, presupuestoController.eliminarPresupuesto);

module.exports = router;
