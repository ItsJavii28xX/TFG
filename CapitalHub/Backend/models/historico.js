module.exports = (sequelize, DataTypes) => {
    const Historico = sequelize.define('Historico', {
      id_historico: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      accion      : DataTypes.STRING,
      fecha       : { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
      tableName : 'Historico',
      timestamps: false
    });
  
    return Historico;
};
  