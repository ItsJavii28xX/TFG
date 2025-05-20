// models/Usuario.js
const bcrypt = require('bcryptjs');
const jwt   = require('jsonwebtoken');
require('dotenv').config();

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id_usuario:    { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre:         DataTypes.STRING,
    apellidos:      DataTypes.STRING,
    email:         { type: DataTypes.STRING, unique: true },
    contraseña:     DataTypes.STRING,
    telefono:       DataTypes.STRING,
    imagen_perfil:  DataTypes.STRING,
    oauth_provider: DataTypes.STRING,
    oauth_id:       DataTypes.STRING
  }, {
    tableName: 'Usuarios',
    timestamps: false
  });

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido en el .env');
  }

  Usuario.prototype.generateAuthToken = async function() {
    const payload    = { id_usuario: this.id_usuario };
    const tokenValue = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });

    const tokenRecord = await sequelize.models.Token.create({ token: tokenValue });
    await sequelize.models.UsuarioToken.create({
      id_usuario: this.id_usuario,
      id_token:   tokenRecord.id_token
    });

    return tokenValue;
  };

  Usuario.findByCredentials = async function(email, password) {

    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new Error('Email y contraseña deben ser cadenas de texto');
    }

    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    if (user.oauth_provider === 'google') {
      throw new Error('Este correo está registrado usando Google Sign-In. Usa “Iniciar con Google”.');
    }

    const isMatch = await bcrypt.compare(password, user.contraseña);
    if (!isMatch) {
      throw new Error('Credenciales inválidas');
    }

    return user;
  };

  Usuario.beforeSave(async (user) => {
    if (user.changed('contraseña')) {
      user.contraseña = await bcrypt.hash(user.contraseña, 8);
    }
  });

  return Usuario;
};
