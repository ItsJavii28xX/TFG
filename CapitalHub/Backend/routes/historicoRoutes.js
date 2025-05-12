const express = require('express');
const router = express.Router();
const historicoController = require('../controllers/historicoController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Historico
 *   description: Operaciones sobre la entidad Historico
 */

/**
 * @swagger
 * /grupos/{idGrupo}/historico:
 *   get:
 *     summary: Obtener el histórico de un grupo
 *     tags: [Historico]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idGrupo
 *         required: true
 *         description: ID del grupo cuyo histórico se desea obtener
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de entradas históricas del grupo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Historico'
 *       404:
 *         description: Grupo no encontrado
 */
router.get('/grupos/:idGrupo/historico', auth, historicoController.obtenerHistoricoGrupo);

/**
 * @swagger
 * /historico/{id}:
 *   get:
 *     summary: Obtener una entrada histórica por ID
 *     tags: [Historico]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la entrada histórica
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Entrada histórica encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Historico'
 *       404:
 *         description: Entrada histórica no encontrada
 */
router.get('/historico/:id', auth, historicoController.obtenerHistoricoPorId);

/**
 * @swagger
 * /grupos/{idGrupo}/historico:
 *   post:
 *     summary: Crear una nueva entrada histórica en un grupo
 *     tags: [Historico]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idGrupo
 *         required: true
 *         description: ID del grupo donde se añade la entrada histórica
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Datos para crear la entrada histórica
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Historico'
 *     responses:
 *       201:
 *         description: Entrada histórica creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Historico'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Grupo no encontrado
 */
router.post('/grupos/:idGrupo/historico', auth, historicoController.crearHistorico);

/**
 * @swagger
 * /historico/{id}:
 *   put:
 *     summary: Actualizar una entrada histórica existente
 *     tags: [Historico]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la entrada histórica a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Campos a actualizar de la entrada histórica
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Historico'
 *     responses:
 *       200:
 *         description: Entrada histórica actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Historico'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Entrada histórica no encontrada
 */
router.put('/historico/:id', auth, historicoController.actualizarHistorico);

/**
 * @swagger
 * /historico/{id}:
 *   delete:
 *     summary: Eliminar una entrada histórica
 *     tags: [Historico]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la entrada histórica a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Entrada histórica eliminada exitosamente
 *       404:
 *         description: Entrada histórica no encontrada
 */
router.delete('/historico/:id', auth, historicoController.eliminarHistorico);

module.exports = router;
