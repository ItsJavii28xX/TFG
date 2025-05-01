module.exports = (sequelize, DataTypes) => {
    const UsuarioGrupo = sequelize.define('UsuarioGrupo', {
      id_usuario_grupo: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      es_administrador: { type: DataTypes.BOOLEAN, defaultValue: false },
      fecha_union     : { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
      tableName : 'Usuarios_Grupos',
      timestamps: false
    });
  
    return UsuarioGrupo;
};
  