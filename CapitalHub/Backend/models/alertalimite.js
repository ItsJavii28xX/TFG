module.exports = (sequelize, DataTypes) => {
    const AlertaLimite = sequelize.define('AlertaLimite', {
      id_alerta: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      limite: DataTypes.DECIMAL(10,2),
      email_notificacion: DataTypes.STRING
    }, {
      tableName: 'Alertas_Limites',
      timestamps: false
    });
  
    return AlertaLimite;
};
  