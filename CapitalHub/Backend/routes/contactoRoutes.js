const express = require('express');
const router = express.Router();
const contactoController = require('../controllers/contactoController');
const auth = require('../middleware/auth');

router.get('/usuarios/:idUsuario/contactos', auth, contactoController.obtenerContactosUsuario);
router.get('/contactos/:id', auth, contactoController.obtenerContactoPorId);

router.post('/usuarios/:idUsuario/contactos', auth, contactoController.crearContacto);

router.put('/contactos/:id', auth, contactoController.actualizarContacto);

router.delete('/contactos/:id', auth, contactoController.eliminarContacto);

module.exports = router;
