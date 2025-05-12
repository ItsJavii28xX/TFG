const express = require('express');
const router = express.Router();
const contactoController = require('../controllers/contactoController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Contacto
 *   description: Operaciones sobre la entidad Contacto
 */

/**
 * @swagger
 * /usuarios/{idUsuario}/contactos:
 *   get:
 *     summary: Obtener todos los contactos de un usuario
 *     tags: [Contacto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         description: ID del usuario cuyos contactos se desean obtener
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de contactos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contacto'
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/usuarios/:idUsuario/contactos', auth, contactoController.obtenerContactosUsuario);

/**
 * @swagger
 * /contactos/{id}:
 *   get:
 *     summary: Obtener un contacto por ID
 *     tags: [Contacto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del contacto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contacto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contacto'
 *       404:
 *         description: Contacto no encontrado
 */
router.get('/contactos/:id', auth, contactoController.obtenerContactoPorId);

/**
 * @swagger
 * /usuarios/{idUsuario}/contactos:
 *   post:
 *     summary: Crear un nuevo contacto para un usuario
 *     tags: [Contacto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         description: ID del usuario al que se añade el contacto
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Datos para crear el contacto
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contacto'
 *     responses:
 *       201:
 *         description: Contacto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contacto'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 */
router.post('/usuarios/:idUsuario/contactos', auth, contactoController.crearContacto);

/**
 * @swagger
 * /contactos/{id}:
 *   put:
 *     summary: Actualizar un contacto existente
 *     tags: [Contacto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del contacto a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Campos a actualizar del contacto
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contacto'
 *     responses:
 *       200:
 *         description: Contacto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contacto'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Contacto no encontrado
 */
router.put('/contactos/:id', auth, contactoController.actualizarContacto);

/**
 * @swagger
 * /contactos/{id}:
 *   delete:
 *     summary: Eliminar un contacto
 *     tags: [Contacto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del contacto a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Contacto eliminado exitosamente
 *       404:
 *         description: Contacto no encontrado
 */
router.delete('/contactos/:id', auth, contactoController.eliminarContacto);

module.exports = router;