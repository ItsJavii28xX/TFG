const sequelize = require('../config/database');
const DataTypes = require('sequelize').DataTypes;

const Usuario = require('./usuario')(sequelize, DataTypes);
const Grupo = require('./grupo')(sequelize, DataTypes);
const UsuarioGrupo = require('./usuariogrupo')(sequelize, DataTypes);
const Presupuesto = require('./presupuesto')(sequelize, DataTypes);
const Gasto = require('./gasto')(sequelize, DataTypes);
const Categoria = require('./categoria')(sequelize, DataTypes);
const Contacto = require('./contacto')(sequelize, DataTypes);
const AlertaLimite = require('./alertalimite')(sequelize, DataTypes);
const Historico = require('./historico')(sequelize, DataTypes);
const Token = require('./token')(sequelize, DataTypes);
const UsuarioToken = require('./usuariotoken')(sequelize, DataTypes);

// Asociaciones
Usuario.belongsToMany(Grupo, { through: UsuarioGrupo, foreignKey: 'id_usuario' });
Grupo.belongsToMany(Usuario, { through: UsuarioGrupo, foreignKey: 'id_grupo' });

Token.belongsToMany(Usuario, { through: UsuarioToken, foreignKey: 'id_token', otherKey: 'id_usuario' });
Usuario.belongsToMany(Token, { through: UsuarioToken, foreignKey: 'id_usuario', otherKey: 'id_token' });

Grupo.hasMany(Presupuesto, { foreignKey: 'id_grupo' });
Presupuesto.belongsTo(Grupo, { foreignKey: 'id_grupo' });

Grupo.hasMany(Gasto, { foreignKey: 'id_grupo' });
Presupuesto.hasMany(Gasto, { foreignKey: 'id_presupuesto' });
Usuario.hasMany(Gasto, { foreignKey: 'id_usuario' });
Gasto.belongsTo(Grupo, { foreignKey: 'id_grupo' });
Gasto.belongsTo(Presupuesto, { foreignKey: 'id_presupuesto' });
Gasto.belongsTo(Usuario, { foreignKey: 'id_usuario' });

Grupo.hasMany(Categoria, { foreignKey: 'id_grupo' });
Categoria.belongsTo(Grupo, { foreignKey: 'id_grupo' });

Usuario.hasMany(Contacto, { foreignKey: 'id_usuario' });
Contacto.belongsTo(Usuario, { foreignKey: 'id_usuario' });

Usuario.hasMany(AlertaLimite, { foreignKey: 'id_usuario' });
AlertaLimite.belongsTo(Usuario, { foreignKey: 'id_usuario' });

Grupo.hasMany(Historico, { foreignKey: 'id_grupo' });
Usuario.hasMany(Historico, { foreignKey: 'id_usuario' });
Historico.belongsTo(Grupo, { foreignKey: 'id_grupo' });
Historico.belongsTo(Usuario, { foreignKey: 'id_usuario' });

module.exports = {
  sequelize,
  Usuario,
  Grupo,
  UsuarioGrupo,
  Presupuesto,
  Gasto,
  Categoria,
  Contacto,
  AlertaLimite,
  Historico,
  Token,
  UsuarioToken
};
