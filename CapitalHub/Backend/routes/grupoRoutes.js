const express = require('express');
const router = express.Router();
const grupoController = require('../controllers/grupoController');
const auth = require('../middleware/auth');

router.get('/grupos', auth, grupoController.obtenerGrupos);
router.get('/grupos/:id', auth, grupoController.obtenerGrupoPorId);

router.post('/grupos', auth, grupoController.crearGrupo);

router.put('/grupos/:id', auth, grupoController.actualizarGrupo);

router.delete('/grupos/:id', auth, grupoController.eliminarGrupo);

module.exports = router;
