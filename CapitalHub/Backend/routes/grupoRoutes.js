const express = require('express');
const router = express.Router();
const grupoController = require('../controllers/grupoController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Grupo
 *   description: Operaciones sobre la entidad Grupo
 */

/**
 * @swagger
 * /grupos:
 *   get:
 *     summary: Obtener todos los grupos
 *     tags: [Grupo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de grupos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Grupo'
 */
router.get('/grupos', auth, grupoController.obtenerGrupos);

/**
 * @swagger
 * /grupos/{id}:
 *   get:
 *     summary: Obtener un grupo por ID
 *     tags: [Grupo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del grupo
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Grupo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grupo'
 *       404:
 *         description: Grupo no encontrado
 */
router.get('/grupos/:id', auth, grupoController.obtenerGrupoPorId);

/**
 * @swagger
 * /grupos:
 *   post:
 *     summary: Crear un nuevo grupo
 *     tags: [Grupo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos para crear el grupo
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Grupo'
 *     responses:
 *       201:
 *         description: Grupo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grupo'
 *       400:
 *         description: Datos inválidos
 */
router.post('/grupos', auth, grupoController.crearGrupo);

/**
 * @swagger
 * /grupos/{id}:
 *   put:
 *     summary: Actualizar un grupo existente
 *     tags: [Grupo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del grupo a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Campos a actualizar del grupo
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Grupo'
 *     responses:
 *       200:
 *         description: Grupo actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grupo'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Grupo no encontrado
 */
router.put('/grupos/:id', auth, grupoController.actualizarGrupo);

/**
 * @swagger
 * /grupos/{id}:
 *   delete:
 *     summary: Eliminar un grupo
 *     tags: [Grupo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del grupo a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Grupo eliminado exitosamente
 *       404:
 *         description: Grupo no encontrado
 */
router.delete('/grupos/:id', auth, grupoController.eliminarGrupo);

module.exports = router;