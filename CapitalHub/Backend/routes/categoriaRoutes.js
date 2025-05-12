const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Categoria
 *   description: Operaciones sobre la entidad Categoria
 */

/**
 * @swagger
 * /grupos/{idGrupo}/categorias:
 *   get:
 *     summary: Obtener todas las categorías de un grupo
 *     tags: [Categoria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idGrupo
 *         required: true
 *         description: ID del grupo cuyas categorías se desean obtener
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de categorías del grupo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 *       404:
 *         description: Grupo no encontrado
 */
router.get('/grupos/:idGrupo/categorias', auth, categoriaController.obtenerCategoriasDeGrupo);

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     summary: Obtener una categoría por ID
 *     tags: [Categoria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       404:
 *         description: Categoría no encontrada
 */
router.get('/categorias/:id', auth, categoriaController.obtenerCategoriaPorId);

/**
 * @swagger
 * /grupos/{idGrupo}/categorias:
 *   post:
 *     summary: Crear una nueva categoría en un grupo
 *     tags: [Categoria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idGrupo
 *         required: true
 *         description: ID del grupo donde se crea la categoría
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Datos para crear la categoría
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Grupo no encontrado
 */
router.post('/grupos/:idGrupo/categorias', auth, categoriaController.crearCategoria);

/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     summary: Actualizar una categoría existente
 *     tags: [Categoria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Campos a actualizar de la categoría
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Categoría no encontrada
 */
router.put('/categorias/:id', auth, categoriaController.actualizarCategoria);

/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     summary: Eliminar una categoría
 *     tags: [Categoria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Categoría eliminada exitosamente
 *       404:
 *         description: Categoría no encontrada
 */
router.delete('/categorias/:id', auth, categoriaController.eliminarCategoria);

module.exports = router;