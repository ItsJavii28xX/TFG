const express = require('express');
const router = express.Router();
const alertaLimiteController = require('../controllers/alertalimiteController');

router.get('/usuarios/:idUsuario/alertas', alertaLimiteController.obtenerAlertasUsuario);
router.post('/usuarios/:idUsuario/alertas', alertaLimiteController.crearAlerta);
router.get('/alertas/:id', alertaLimiteController.obtenerAlertaPorId);
router.put('/alertas/:id', alertaLimiteController.actualizarAlerta);
router.delete('/alertas/:id', alertaLimiteController.eliminarAlerta);

module.exports = router;
