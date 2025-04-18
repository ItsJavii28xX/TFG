module.exports = (sequelize, DataTypes) => {
    const Grupo = sequelize.define('Grupo', {
      id_grupo: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      nombre: DataTypes.STRING,
      fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
      tableName: 'Grupos',
      timestamps: false
    });
  
    return Grupo;
};
