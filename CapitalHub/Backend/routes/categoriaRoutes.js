const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

router.get('/grupos/:idGrupo/categorias', categoriaController.obtenerCategoriasDeGrupo);
router.post('/grupos/:idGrupo/categorias', categoriaController.crearCategoria);
router.get('/categorias/:id', categoriaController.obtenerCategoriaPorId);
router.put('/categorias/:id', categoriaController.actualizarCategoria);
router.delete('/categorias/:id', categoriaController.eliminarCategoria);

module.exports = router;
