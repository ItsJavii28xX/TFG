require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const nodemailer       = require('nodemailer');
const jwt              = require('jsonwebtoken');
const { Usuario }      = require('../models');
const { Token }        = require('../models');
const { UsuarioToken } = require('../models');



const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const transporter = nodemailer.createTransport({
  host  : process.env.SMTP_HOST,
  port  : process.env.SMTP_PORT,
  secure: true,
  auth  : {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

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
    usuario ? res.json(usuario): res.status(404).json({ error: 'Usuario no encontrado' });
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
    const user  = await Usuario.findByCredentials(email, contraseña);
    const token = await user.generateAuthToken();
    res.json({ token });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.loginShort = async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    if (!email || !contraseña) {
      return res.status(400).json({ error: 'Faltan email o contraseña' });
    }
    const user = await Usuario.findByCredentials(email, contraseña);

    const payload    = { id_usuario: user.id_usuario };
    const tokenValue = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });

    const tokenRecord = await Token.create({ token: tokenValue });
    await UsuarioToken.create({
      id_usuario: user.id_usuario,
      id_token  : tokenRecord.id_token
    });

    res.json({ token: tokenValue });
  } catch (err) {
    console.error('Error en loginShort:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.loginWithGoogle = async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket         = await client.verifyIdToken({
      idToken : credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();

      // 1. ¿Existe ya un usuario Google con este sub?
    let user = await Usuario.findOne({
      where: {
        oauth_provider: 'google',
        oauth_id      : payload.sub
      }
    });

    if (!user) {
        // 2. ¿Existe un usuario LOCAL con este email?
      const existingByEmail = await Usuario.findOne({
        where: { email: payload.email }
      });

      if (existingByEmail && existingByEmail.oauth_provider !== 'google') {
          // Ya hay un registro con ese email usando otro método
        return res.status(400).json({
          error: 'Este correo ya está registrado. Por favor, inicia sesión con tu contraseña.'
        });
      }

        // 3. Creamos nuevo usuario Google
      user = await Usuario.create({
        nombre        : payload.given_name,
        apellidos     : payload.family_name,
        email         : payload.email,
        contraseña    : null,
        imagen_perfil : payload.picture,
        oauth_provider: 'google',
        oauth_id      : payload.sub
      });
    }

      // 4. Generar y devolver token
    const token = await user.generateAuthToken();
    res.json({ token });

  } catch (err) {
    console.error('Google login error:', err);
    res.status(400).json({ error: 'Google login failed' });
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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Usuario.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Genera un token JWT para reseteo, válido 1h
    const resetToken = jwt.sign(
      { id_usuario: user.id_usuario },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from:    `<${process.env.SMTP_USER}>`,
      to:      user.email,
      subject: 'Restablece tu contraseña',
      html: `
        <p>Hola ${user.nombre},</p>
        <p>Pulsa <a href="${resetLink}">aquí</a> para restablecer tu contraseña. El enlace expirará en 1 hora.</p>
      `
    });

    res.json({ mensaje: 'Email de restablecimiento enviado' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Error al enviar email' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    const user = await Usuario.findByPk(payload.id_usuario);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    user.contraseña = newPassword;
    await user.save();
    res.json({ mensaje: 'Contraseña restablecida correctamente' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Error al restablecer contraseña' });
  }
};