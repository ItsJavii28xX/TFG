const express = require('express');
const router = express.Router();
const usuarioGrupoController = require('../controllers/usuarioGrupoController');

router.get('/usuarios-grupos', usuarioGrupoController.obtenerUsuariosGrupos);
router.post('/usuarios-grupos', usuarioGrupoController.crearUsuarioGrupo);
router.get('/usuarios-grupos/:id', usuarioGrupoController.obtenerUsuarioGrupoPorId);
router.put('/usuarios-grupos/:id', usuarioGrupoController.actualizarUsuarioGrupo);
router.delete('/usuarios-grupos/:id', usuarioGrupoController.eliminarUsuarioGrupo);

module.exports = router;
