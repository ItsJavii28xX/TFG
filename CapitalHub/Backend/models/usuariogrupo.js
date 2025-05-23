module.exports = (sequelize, DataTypes) => {
    const UsuarioGrupo = sequelize.define('UsuarioGrupo', {
      id_usuario_grupo: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      id_usuario      : { type: DataTypes.INTEGER, allowNull: false },
      id_grupo        : { type: DataTypes.INTEGER, allowNull: false },
      es_administrador: { type: DataTypes.BOOLEAN, defaultValue: false },
      fecha_union     : { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
      tableName : 'Usuarios_Grupos',
      timestamps: false
    });
  
    return UsuarioGrupo;
};
  