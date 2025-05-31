const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Registra un usuario nuevo
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellidos
 *               - email
 *               - contraseña
 *             properties:
 *               email:
 *                 type: string
 *               contraseña:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       '400':
 *         description: Error de validación
 */
router.post('/usuarios', usuarioController.crearUsuario);

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Inicia sesión
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - contraseña
 *             properties:
 *               email:
 *                 type: string
 *               contraseña:
 *                 type: string
 *     responses:
 *       '200':
 *         description: JWT generado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       '400':
 *         description: Credenciales inválidas
 */
router.post('/usuarios/login', usuarioController.login);

/**
 * @swagger
 * /usuarios/login-short:
 *   post:
 *     summary: Inicia sesión con token de 12h
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - contraseña
 *             properties:
 *               email:
 *                 type: string
 *               contraseña:
 *                 type: string
 *     responses:
 *       '200':
 *         description: JWT generado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       '400':
 *         description: Credenciales inválidas
 */
router.post('/usuarios/login-short', usuarioController.loginShort);

router.post('/usuarios/login-google', usuarioController.loginWithGoogle);

/**
 * @swagger
 * /usuarios/logout:
 *   post:
 *     summary: Cierra la sesión del usuario eliminando su token
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Logout exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Logout exitoso
 *       '400':
 *         description: Token no proporcionado
 *       '404':
 *         description: Token no encontrado
 *       '500':
 *         description: Error al cerrar sesión
 */
router.post('/usuarios/logout', auth, usuarioController.logout);

router.post('/usuarios/logout-all', auth, usuarioController.logoutAll);

router.post('/usuarios/forgot-password', usuarioController.forgotPassword);

router.post('/usuarios/reset-password', usuarioController.resetPassword);

router.post('/usuarios/:id/verify-password', auth, usuarioController.verifyPassword);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Array de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       '401':
 *         description: Por favor autentícate.
 */
router.get('/usuarios', auth, usuarioController.obtenerUsuarios);

router.get('/usuarios/email/:email', auth, usuarioController.obtenerUsuarioPorEmail);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       '404':
 *         description: Usuario no encontrado
 */
router.get('/usuarios/:id', auth, usuarioController.obtenerUsuarioPorId);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualiza los datos de un usuario existente
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               telefono:
 *                 type: string
 *               imagen_perfil:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       '400':
 *         description: Datos inválidos
 *       '404':
 *         description: Usuario no encontrado
 */
router.put('/usuarios/:id', auth, usuarioController.actualizarUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Usuario eliminado correctamente
 *       '404':
 *         description: Usuario no encontrado
 */
router.delete('/usuarios/:id', auth, usuarioController.eliminarUsuario);

router.delete('/usuarioCascada', auth, usuarioController.deleteUsersCascade);

module.exports = router;
