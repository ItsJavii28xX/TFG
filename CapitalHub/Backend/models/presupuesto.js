module.exports = (sequelize, DataTypes) => {
    const Presupuesto = sequelize.define('Presupuesto', {
      id_presupuesto: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      nombre: DataTypes.STRING,
      cantidad: DataTypes.DECIMAL(10,2),
      descripcion: DataTypes.TEXT,
      fecha_inicio: DataTypes.DATE,
      fecha_fin: DataTypes.DATE
    }, {
      tableName: 'Presupuestos',
      timestamps: false
    });
  
    return Presupuesto;
};
  