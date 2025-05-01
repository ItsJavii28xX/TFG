const express = require('express');
const router = express.Router();
const alertaLimiteController = require('../controllers/alertalimiteController');
const auth = require('../middleware/auth');

router.get('/usuarios/:idUsuario/alertas', auth, alertaLimiteController.obtenerAlertasUsuario);
router.get('/alertas/:id', auth, alertaLimiteController.obtenerAlertaPorId);

router.post('/usuarios/:idUsuario/alertas', auth, alertaLimiteController.crearAlerta);

router.put('/alertas/:id', auth, alertaLimiteController.actualizarAlerta);

router.delete('/alertas/:id', auth, alertaLimiteController.eliminarAlerta);

module.exports = router;
