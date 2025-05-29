module.exports = (sequelize, DataTypes) => {
     const Contacto = sequelize.define('Contacto', {
    id_contacto: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_usuario_propietario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_usuario_contacto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombre:       DataTypes.STRING,
    email:        DataTypes.STRING,
    telefono:     DataTypes.STRING,
  }, {
    tableName : 'Contactos',
    timestamps: false
  });
  
  return Contacto;

};
  