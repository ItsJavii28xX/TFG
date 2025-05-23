const express = require('express');
const router = express.Router();
const usuarioGrupoController = require('../controllers/usuariogrupoController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: UsuarioGrupo
 *   description: Operaciones sobre la entidad UsuarioGrupo
 */

/**
 * @swagger
 * /usuarios-grupos:
 *   get:
 *     summary: Obtener todos los UsuarioGrupo
 *     tags: [UsuarioGrupo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de UsuarioGrupo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UsuarioGrupo'
 */
router.get('/usuarios-grupos', auth, usuarioGrupoController.obtenerUsuariosGrupos);

router.get('/usuarios/:idUsuario/grupos', auth, usuarioGrupoController.obtenerGruposDeUsuario);

/**
 * @swagger
 * /usuarios-grupos/{id}:
 *   get:
 *     summary: Obtener un UsuarioGrupo por ID
 *     tags: [UsuarioGrupo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del UsuarioGrupo
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: UsuarioGrupo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioGrupo'
 *       404:
 *         description: UsuarioGrupo no encontrado
 */
router.get('/usuarios-grupos/:id', auth, usuarioGrupoController.obtenerUsuarioGrupoPorId);

/**
 * @swagger
 * /usuarios-grupos:
 *   post:
 *     summary: Crear un nuevo UsuarioGrupo
 *     tags: [UsuarioGrupo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos para crear un UsuarioGrupo
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioGrupo'
 *     responses:
 *       201:
 *         description: UsuarioGrupo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioGrupo'
 *       400:
 *         description: Datos inválidos
 */
router.post('/usuarios-grupos', auth, usuarioGrupoController.crearUsuarioGrupo);

/**
 * @swagger
 * /usuarios-grupos/{id}:
 *   put:
 *     summary: Actualizar un UsuarioGrupo existente
 *     tags: [UsuarioGrupo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del UsuarioGrupo a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Campos a actualizar del UsuarioGrupo
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioGrupo'
 *     responses:
 *       200:
 *         description: UsuarioGrupo actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioGrupo'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: UsuarioGrupo no encontrado
 */
router.put('/usuarios-grupos/:id', auth, usuarioGrupoController.actualizarUsuarioGrupo);

/**
 * @swagger
 * /usuarios-grupos/{id}:
 *   delete:
 *     summary: Eliminar un UsuarioGrupo
 *     tags: [UsuarioGrupo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del UsuarioGrupo a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: UsuarioGrupo eliminado exitosamente
 *       404:
 *         description: UsuarioGrupo no encontrado
 */
router.delete('/usuarios-grupos/:id', auth, usuarioGrupoController.eliminarUsuarioGrupo);

module.exports = router;
