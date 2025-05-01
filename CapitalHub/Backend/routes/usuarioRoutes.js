const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const auth = require('../middleware/auth');

router.get('/usuarios', auth, usuarioController.obtenerUsuarios);
router.get('/usuarios/:id', auth, usuarioController.obtenerUsuarioPorId);

router.post('/usuarios', usuarioController.crearUsuario);
router.post('/usuarios/login', usuarioController.login);
router.post('/usuarios/logout', auth, usuarioController.logout);

router.put('/usuarios/:id', auth, usuarioController.actualizarUsuario);

router.delete('/usuarios/:id', auth, usuarioController.eliminarUsuario);

module.exports = router;
