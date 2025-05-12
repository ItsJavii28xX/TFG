const express = require('express');
const router = express.Router();
const alertaLimiteController = require('../controllers/alertalimiteController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: AlertaLimite
 *   description: Operaciones sobre la entidad AlertaLimite
 */

/**
 * @swagger
 * /usuarios/{idUsuario}/alertas:
 *   get:
 *     summary: Obtener todas las alertas de límite de un usuario
 *     tags: [AlertaLimite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         description: ID del usuario cuyas alertas se desean obtener
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de alertas de límite del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AlertaLimite'
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/usuarios/:idUsuario/alertas', auth, alertaLimiteController.obtenerAlertasUsuario);

/**
 * @swagger
 * /alertas/{id}:
 *   get:
 *     summary: Obtener una alerta de límite por ID
 *     tags: [AlertaLimite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la alerta de límite
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Alerta de límite encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlertaLimite'
 *       404:
 *         description: Alerta de límite no encontrada
 */
router.get('/alertas/:id', auth, alertaLimiteController.obtenerAlertaPorId);

/**
 * @swagger
 * /usuarios/{idUsuario}/alertas:
 *   post:
 *     summary: Crear una nueva alerta de límite para un usuario
 *     tags: [AlertaLimite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         description: ID del usuario al que se añade la alerta
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Datos para crear la alerta de límite
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlertaLimite'
 *     responses:
 *       201:
 *         description: Alerta de límite creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlertaLimite'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 */
router.post('/usuarios/:idUsuario/alertas', auth, alertaLimiteController.crearAlerta);

/**
 * @swagger
 * /alertas/{id}:
 *   put:
 *     summary: Actualizar una alerta de límite existente
 *     tags: [AlertaLimite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la alerta de límite a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Campos a actualizar de la alerta de límite
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlertaLimite'
 *     responses:
 *       200:
 *         description: Alerta de límite actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlertaLimite'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Alerta de límite no encontrada
 */
router.put('/alertas/:id', auth, alertaLimiteController.actualizarAlerta);

/**
 * @swagger
 * /alertas/{id}:
 *   delete:
 *     summary: Eliminar una alerta de límite
 *     tags: [AlertaLimite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la alerta de límite a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Alerta de límite eliminada exitosamente
 *       404:
 *         description: Alerta de límite no encontrada
 */
router.delete('/alertas/:id', auth, alertaLimiteController.eliminarAlerta);

module.exports = router;
