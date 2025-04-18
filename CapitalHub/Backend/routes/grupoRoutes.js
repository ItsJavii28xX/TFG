const express = require('express');
const router = express.Router();
const grupoController = require('../controllers/grupoController');

router.get('/grupos', grupoController.obtenerGrupos);
router.post('/grupos', grupoController.crearGrupo);
router.get('/grupos/:id', grupoController.obtenerGrupoPorId);
router.put('/grupos/:id', grupoController.actualizarGrupo);
router.delete('/grupos/:id', grupoController.eliminarGrupo);

module.exports = router;
