const express = require('express');
const router = express.Router();
const gastoController = require('../controllers/gastoController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Gasto
 *   description: Operaciones sobre la entidad Gasto
 */

/**
 * @swagger
 * /grupos/{idGrupo}/gastos:
 *   get:
 *     summary: Obtener todos los gastos de un grupo
 *     tags: [Gasto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idGrupo
 *         required: true
 *         description: ID del grupo cuyos gastos se desean obtener
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de gastos del grupo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Gasto'
 *       404:
 *         description: Grupo no encontrado
 */
router.get('/grupos/:idGrupo/gastos', auth, gastoController.obtenerGastosDeGrupo);

/**
 * @swagger
 * /gastos/{id}:
 *   get:
 *     summary: Obtener un gasto por ID
 *     tags: [Gasto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del gasto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gasto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gasto'
 *       404:
 *         description: Gasto no encontrado
 */
router.get('/gastos/:id', auth, gastoController.obtenerGastoPorId);

/**
 * @swagger
 * /grupos/{idGrupo}/gastos:
 *   post:
 *     summary: Crear un nuevo gasto en un grupo
 *     tags: [Gasto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idGrupo
 *         required: true
 *         description: ID del grupo donde se crea el gasto
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Datos para crear el gasto
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Gasto'
 *     responses:
 *       201:
 *         description: Gasto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gasto'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Grupo no encontrado
 */
router.post('/grupos/:idGrupo/gastos', auth, gastoController.crearGasto);

/**
 * @swagger
 * /gastos/{id}:
 *   put:
 *     summary: Actualizar un gasto existente
 *     tags: [Gasto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del gasto a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Campos a actualizar del gasto
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Gasto'
 *     responses:
 *       200:
 *         description: Gasto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gasto'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Gasto no encontrado
 */
router.put('/gastos/:id', auth, gastoController.actualizarGasto);

/**
 * @swagger
 * /gastos/{id}:
 *   delete:
 *     summary: Eliminar un gasto
 *     tags: [Gasto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del gasto a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Gasto eliminado exitosamente
 *       404:
 *         description: Gasto no encontrado
 */
router.delete('/gastos/:id', auth, gastoController.eliminarGasto);

module.exports = router;
