const express = require('express');
const router = express.Router();
const contactoController = require('../controllers/contactoController');

router.get('/usuarios/:idUsuario/contactos', contactoController.obtenerContactosUsuario);
router.post('/usuarios/:idUsuario/contactos', contactoController.crearContacto);
router.get('/contactos/:id', contactoController.obtenerContactoPorId);
router.put('/contactos/:id', contactoController.actualizarContacto);
router.delete('/contactos/:id', contactoController.eliminarContacto);

module.exports = router;
