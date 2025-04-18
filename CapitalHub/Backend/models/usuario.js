module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
      id_usuario: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      nombre: DataTypes.STRING,
      apellidos: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: true },
      contraseña: DataTypes.STRING,
      telefono: DataTypes.STRING,
      imagen_perfil: DataTypes.STRING,
      oauth_provider: DataTypes.STRING,
      oauth_id: DataTypes.STRING
    }, {
      tableName: 'Usuarios',
      timestamps: false
    });
  
    return Usuario;
};
  