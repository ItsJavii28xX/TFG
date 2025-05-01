require('dotenv').config();
const { Usuario } = require('../models');

exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

exports.crearUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    usuario ? res.json(usuario) : res.status(404).json({ error: 'Usuario no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    await usuario.update(req.body);
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    await usuario.destroy();
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    if (!email || !contraseña) {
      return res.status(400).json({ error: 'Faltan email o contraseña' });
    }
    const user = await Usuario.findByCredentials(email, contraseña);
    const token = await user.generateAuthToken();
    res.json({ token });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(400).json({ error: 'Token no proporcionado' });
    const tokenValue = authHeader.replace('Bearer ', '');

    const tokenRecord = await Token.findOne({ where: { token: tokenValue } });
    if (!tokenRecord) return res.status(404).json({ error: 'Token no encontrado' });

    await UsuarioToken.destroy({ where: { id_token: tokenRecord.id_token } });
    await tokenRecord.destroy();
    res.json({ mensaje: 'Logout exitoso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al cerrar sesión' });
  }
};