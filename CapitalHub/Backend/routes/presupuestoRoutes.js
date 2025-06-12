const express = require('express');
const router = express.Router();
const presupuestoController = require('../controllers/presupuestoController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Presupuesto
 *   description: Operaciones sobre la entidad Presupuesto
 */

/**
 * @swagger
 * /grupos/{idGrupo}/presupuestos:
 *   get:
 *     summary: Obtener todos los presupuestos de un grupo
 *     tags: [Presupuesto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idGrupo
 *         required: true
 *         description: ID del grupo
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de presupuestos del grupo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Presupuesto'
 *       404:
 *         description: Grupo no encontrado
 */
router.get('/grupos/:idGrupo/presupuestos', auth, presupuestoController.obtenerPresupuestosDeGrupo);

/**
 * @swagger
 * /presupuestos/{id}:
 *   get:
 *     summary: Obtener un presupuesto por ID
 *     tags: [Presupuesto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del presupuesto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Presupuesto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Presupuesto'
 *       404:
 *         description: Presupuesto no encontrado
 */
router.get('/presupuestos/:id', auth, presupuestoController.obtenerPresupuestoPorId);

/**
 * @swagger
 * /grupos/{idGrupo}/presupuestos:
 *   post:
 *     summary: Crear un nuevo presupuesto en un grupo
 *     tags: [Presupuesto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idGrupo
 *         required: true
 *         description: ID del grupo donde se crea el presupuesto
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Datos para crear el presupuesto
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Presupuesto'
 *     responses:
 *       201:
 *         description: Presupuesto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Presupuesto'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Grupo no encontrado
 */
router.post('/grupos/:idGrupo/presupuestos', auth, presupuestoController.crearPresupuesto);

/**
 * @swagger
 * /presupuestos/{id}:
 *   put:
 *     summary: Actualizar un presupuesto existente
 *     tags: [Presupuesto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del presupuesto a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Campos a actualizar del presupuesto
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Presupuesto'
 *     responses:
 *       200:
 *         description: Presupuesto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Presupuesto'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Presupuesto no encontrado
 */
router.put('/presupuestos/:id', auth, presupuestoController.actualizarPresupuesto);

router.delete('/presupuestos/:id/borrarCascada', auth, presupuestoController.eliminarPresupuestosEnCascada);

/**
 * @swagger
 * /presupuestos/{id}:
 *   delete:
 *     summary: Eliminar un presupuesto
 *     tags: [Presupuesto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del presupuesto a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Presupuesto eliminado exitosamente
 *       404:
 *         description: Presupuesto no encontrado
 */
router.delete('/presupuestos/:id', auth, presupuestoController.eliminarPresupuesto);



module.exports = router;
