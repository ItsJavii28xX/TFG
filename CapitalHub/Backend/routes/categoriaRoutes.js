const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const auth = require('../middleware/auth');

router.get('/grupos/:idGrupo/categorias', auth, categoriaController.obtenerCategoriasDeGrupo);
router.get('/categorias/:id', auth, categoriaController.obtenerCategoriaPorId);

router.post('/grupos/:idGrupo/categorias', auth, categoriaController.crearCategoria);

router.put('/categorias/:id', auth, categoriaController.actualizarCategoria);
router.delete('/categorias/:id', auth, categoriaController.eliminarCategoria);

module.exports = router;
