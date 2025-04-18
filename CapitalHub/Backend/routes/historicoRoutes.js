const express = require('express');
const router = express.Router();
const historicoController = require('../controllers/historicoController');

router.get('/grupos/:idGrupo/historico', historicoController.obtenerHistoricoGrupo);
router.post('/grupos/:idGrupo/historico', historicoController.crearHistorico);
router.get('/historico/:id', historicoController.obtenerHistoricoPorId);
router.put('/historico/:id', historicoController.actualizarHistorico);
router.delete('/historico/:id', historicoController.eliminarHistorico);

module.exports = router;
