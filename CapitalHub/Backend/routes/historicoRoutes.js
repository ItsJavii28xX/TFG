const express = require('express');
const router = express.Router();
const historicoController = require('../controllers/historicoController');
const auth = require('../middleware/auth');

router.get('/grupos/:idGrupo/historico', auth, historicoController.obtenerHistoricoGrupo);
router.get('/historico/:id', auth, historicoController.obtenerHistoricoPorId);

router.post('/grupos/:idGrupo/historico', auth, historicoController.crearHistorico);

router.put('/historico/:id', auth, historicoController.actualizarHistorico);

router.delete('/historico/:id', auth, historicoController.eliminarHistorico);

module.exports = router;
