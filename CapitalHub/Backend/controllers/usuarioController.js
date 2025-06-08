require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const nodemailer       = require('nodemailer');
const jwt              = require('jsonwebtoken');
const bcrypt           = require('bcryptjs');
const sequelize        = require('../config/database');
const { Op }          = require('sequelize');
const { Usuario, Token, UsuarioToken, Grupo, UsuarioGrupo, Contacto } = require('../models');


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
    const usuario = await Usuario.create({
      nombre:        req.body.nombre,
      apellidos:     req.body.apellidos,
      email:         req.body.email,
      contraseña:    req.body.contraseña,
      telefono:      req.body.telefono,
      imagen_perfil: req.body.imagen_perfil,
    });
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

exports.obtenerUsuarioPorEmail = async (req, res) => {
  try {
    // decodeURIComponent convertirá "%40" en "@"
    const email = decodeURIComponent(req.params.email);
    const user  = await Usuario.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar usuario por email' });
  }
};


exports.searchUsuarios = async (req, res) => {
  try {
    // 1) Recuperamos el parámetro "q" de la query string
    const query = req.query.q?.trim();
    if (!query || query.length < 1) {
      // Si no viene query o está vacío, devolvemos array vacío
      return res.json([]);
    }

    // 2) Buscamos de forma case-insensitive en nombre y apellidos
    const usuarios = await Usuario.findAll({
      where: {
        [Op.or]: [
          { nombre: { [Op.like]: `%${query}%` } },
          { apellidos: { [Op.like]: `%${query}%` } }
        ]
      },
      attributes: ['id_usuario', 'nombre', 'apellidos', 'email', 'telefono', 'imagen_perfil']
    });

    // 3) Devolvemos el array de coincidencias
    return res.json(usuarios);
  } catch (error) {
    console.error('Error en searchUsuarios:', error);
    return res.status(500).json({ error: 'Error al buscar usuarios.' });
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

exports.deleteUsersCascade = async (req, res) => {
  const ids = req.body.ids;
  if (!Array.isArray(ids) || !ids.length) {
    return res.status(400).json({ error: 'Debe enviar un array de IDs de usuario' });
  }

  const t = await sequelize.transaction();
  try {
    for (const idUsuario of ids) {
      // 1) Encontrar todos los tokens asociados a este usuario
      const userTokens = await UsuarioToken.findAll({
        where: { id_usuario: idUsuario },
        transaction: t
      });
      const tokenIds = userTokens.map(ut => ut.id_token);

      // 2) Borrar relaciones UsuarioToken de este usuario
      await UsuarioToken.destroy({
        where: { id_usuario: idUsuario },
        transaction: t
      });

      // 3) Borrar registros en Token para esos id_token
      if (tokenIds.length) {
        await Token.destroy({
          where: { id_token: tokenIds },
          transaction: t
        });
      }

      // 4) Borrar todos los contactos cuyo id_usuario_propietario sea este user
      await Contacto.destroy({
        where: { id_usuario_contacto: idUsuario },
        transaction: t
      });

      // 5) Finalmente borrar el propio usuario
      await Usuario.destroy({
        where: { id_usuario: idUsuario },
        transaction: t
      });
    }

    await t.commit();
    res.status(204).send();
  } catch (error) {
    await t.rollback();
    console.error('Error en deleteUsersCascade:', error);
    res.status(500).json({ error: 'Error al borrar usuarios en cascada' });
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
    
    const personalName = `${user.nombre} ${user.apellidos}`.trim();
    const [personalGrp] = await Grupo.findOrCreate({
      where: { nombre: personalName }
    });
    await UsuarioGrupo.findOrCreate({
      where: {
        id_usuario: user.id_usuario,
        id_grupo:   personalGrp.id_grupo
      },
      defaults: {
        es_administrador: true
      }
    });
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

    const personalName = `${user.nombre} ${user.apellidos}`.trim();
    const [personalGrp] = await Grupo.findOrCreate({
      where: { nombre: personalName }
    });
    await UsuarioGrupo.findOrCreate({
      where: {
        id_usuario: user.id_usuario,
        id_grupo:   personalGrp.id_grupo
      },
      defaults: {
        es_administrador: true
      }
    });

    res.json({ token: tokenValue });
  } catch (err) {
    console.error('Error en loginShort:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.loginWithGoogle = async (req, res) => {
  console.log('loginWithGoogle.body:', req.body);

  try {
    const { credential } = req.body;
    if (!credential) {
      console.log('⚠️ No credential in body');
      return res.status(400).json({ error: 'No credential provided' });
    }

    // Verificamos el ID token con Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    console.log('Google payload:', payload);
    // payload contains: email, sub (Google user ID), name, picture, etc.

    // 1. Buscar usuario por proveedor Google
    let user = await Usuario.findOne({
      where: {
        oauth_provider: 'google',
        oauth_id:       payload.sub
      }
    });

    if (!user) {
      // 2. Si no existe, comprobar si el email ya está registrado por otro método
      const existing = await Usuario.findOne({ where: { email: payload.email } });
      if (existing && existing.oauth_provider !== 'google') {
        return res.status(400).json({
          error: 'Este email está registrado con contraseña. Por favor usa el login tradicional.'
        });
      }

      // 3. Crear nuevo usuario Google
      user = await Usuario.create({
        nombre:         payload.given_name || payload.name,
        apellidos:      payload.family_name || '',
        email:          payload.email,
        contraseña:     Math.random().toString(36).slice(2), // Contraseña aleatoria
        imagen_perfil:  payload.picture,
        oauth_provider: 'google',
        oauth_id:       payload.sub
      });
      console.log('Nuevo usuario Google creado:', user.id_usuario);
    }

    // 4. Generar JWT + guardarlo en Token & UsuarioToken
    const tokenValue = await user.generateAuthToken();
    console.log('Token generado para usuario:', user.id_usuario);

    const personalName = `${user.nombre} ${user.apellidos}`.trim();
    const [personalGrp] = await Grupo.findOrCreate({
      where: { nombre: personalName }
    });
    await UsuarioGrupo.findOrCreate({
      where: {
        id_usuario: user.id_usuario,
        id_grupo:   personalGrp.id_grupo
      },
      defaults: {
        es_administrador: true
      }
    });

    // 5. Devolver token al cliente
    res.json({ token: tokenValue });

  } catch (err) {
    console.error('Google login error:', err);
    res.status(400).json({ error: err.message || 'Google login failed' });
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

exports.logoutAll = async (req, res) => {
  try {
    // req.user viene del middleware auth
    const userId = req.user.id_usuario;

    // 1) obtener todos los id_token de este usuario
    const relations = await UsuarioToken.findAll({
      where: { id_usuario: userId },
      attributes: ['id_token']
    });
    const tokenIds = relations.map(r => r.id_token);

    // 2) eliminar las relaciones usuario-token
    await UsuarioToken.destroy({ where: { id_usuario: userId } });

    // 3) eliminar los tokens en sí
    if (tokenIds.length) {
      await Token.destroy({ where: { id_token: tokenIds } });
    }

    // 4) finalmente respondemos
    res.json({ mensaje: 'Sesión cerrada en todos los dispositivos' });
  } catch (err) {
    console.error('Error en logoutAll:', err);
    res.status(500).json({ error: 'Error al cerrar sesión en todos los dispositivos' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si viene de Google, no mandamos mail y mandamos aviso al usuario
    if (user.oauth_provider === 'google') {
      return res.status(400).json({
        error: 'Diríjase a los ajustes de su cuenta de Google para restablecer su contraseña'
      });
    }

    // Usuario local: generamos token y mandamos mail
    const resetToken = jwt.sign(
      { id_usuario: user.id_usuario },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from:    `"CapitalHub" <${process.env.SMTP_USER}>`,
      to:      user.email,
      subject: 'Restablece tu contraseña',
      html: `
        <p>Hola ${user.nombre},</p>
        <p>Pulsa <a href="${resetLink}">aquí</a> para restablecer tu contraseña.  
        El enlace expirará en 1 hora.</p>
      `
    });

    res.json({ mensaje: 'Email de restablecimiento enviado' });

  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Error al enviar email' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token y nueva contraseña obligatorios' });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(400).json({ error: err.name === 'TokenExpiredError'
      ? 'El enlace ha expirado'
      : 'Token inválido' });
  }

  const user = await Usuario.findByPk(payload.id_usuario);
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  if (user.oauth_provider === 'google') {
    return res.status(400).json({
      error: 'Esta cuenta usa Google Sign-In. Gestiona tu contraseña desde Google.'
    });
  }

  // Actualiza la contraseña (beforeSave la hashea)
  user.contraseña = newPassword;
  await user.save();

  // Revocar todos los tokens activos
  const relations = await UsuarioToken.findAll({
    where: { id_usuario: user.id_usuario },
    attributes: ['id_token']
  });
  const tokenIds = relations.map(r => r.id_token);
  await UsuarioToken.destroy({ where: { id_usuario: user.id_usuario } });
  if (tokenIds.length) {
    await Token.destroy({ where: { id_token: tokenIds } });
  }

  res.json({ mensaje: 'Contraseña restablecida con éxito' });
};

exports.verifyPassword = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Debe proporcionar la contraseña actual' });
    }

    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Compara plaintext vs hash
    const match = await bcrypt.compare(password, usuario.contraseña);

    // **Devuelve directamente el booleano**, no { valid: match }
    return res.json(match);
  } catch (err) {
    console.error('Error en verifyPassword:', err);
    return res.status(500).json({ error: 'Error interno al verificar contraseña' });
  }
};