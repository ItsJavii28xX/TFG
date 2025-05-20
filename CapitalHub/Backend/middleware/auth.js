const jwt = require('jsonwebtoken');
const { Usuario, Token, UsuarioToken } = require('../models');

module.exports = async function auth(req, res, next) {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ error: 'Falta cabecera Authorization' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(400).json({ error: 'Formato de token inválido' });
    }
    const tokenString = parts[1];

    let decoded;
    try {
      decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        const tokenRecord = await Token.findOne({ where: { token: tokenString } });
        if (tokenRecord) {
          await UsuarioToken.destroy({ where: { id_token: tokenRecord.id_token } });
          await tokenRecord.destroy();
        }
        return res.status(401).json({ error: 'Token expirado' });
      }
      return res.status(401).json({ error: 'Token inválido' });
    }

    const token = await Token.findOne({ where: { token: tokenString } });
    if (!token) {
      return res.status(401).json({ error: 'Token no reconocido' });
    }

    const usuarioToken = await UsuarioToken.findOne({
      where: {
        id_token:   token.id_token,
        id_usuario: decoded.id_usuario
      }
    });
    if (!usuarioToken) {
      return res.status(403).json({ error: 'Token no asociado a este usuario' });
    }

    const usuario = await Usuario.findByPk(decoded.id_usuario);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    req.user  = usuario;
    req.token = tokenString;
    next();

  } catch (err) {
    console.error('Error en auth middleware:', err);
    res.status(500).json({ error: 'Error interno de autenticación' });
  }
};
