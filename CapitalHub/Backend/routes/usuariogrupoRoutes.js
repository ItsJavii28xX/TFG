const express = require('express');
const router = express.Router();
const usuarioGrupoController = require('../controllers/usuariogrupoController');
const auth = require('../middleware/auth');

router.get('/usuarios-grupos', auth,  usuarioGrupoController.obtenerUsuariosGrupos);
router.get('/usuarios-grupos/:id', auth,  usuarioGrupoController.obtenerUsuarioGrupoPorId);

router.post('/usuarios-grupos', auth,  usuarioGrupoController.crearUsuarioGrupo);

router.put('/usuarios-grupos/:id', auth,  usuarioGrupoController.actualizarUsuarioGrupo);

router.delete('/usuarios-grupos/:id', auth, usuarioGrupoController.eliminarUsuarioGrupo);

module.exports = router;
