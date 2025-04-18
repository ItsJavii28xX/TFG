module.exports = (sequelize, DataTypes) => {
    const Gasto = sequelize.define('Gasto', {
      id_gasto: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      nombre: DataTypes.STRING,
      cantidad: DataTypes.DECIMAL(10,2),
      descripcion: DataTypes.TEXT,
      estado: { 
        type: DataTypes.ENUM('pendiente', 'aceptado', 'denegado'), 
        defaultValue: 'pendiente' 
      },
      fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
      tableName: 'Gastos',
      timestamps: false
    });
  
    return Gasto;
};
  