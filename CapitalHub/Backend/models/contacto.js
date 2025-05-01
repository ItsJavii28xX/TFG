module.exports = (sequelize, DataTypes) => {
    const Contacto = sequelize.define('Contacto', {
      id_contacto: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      nombre     : DataTypes.STRING,
      email      : DataTypes.STRING,
      telefono   : DataTypes.STRING
    }, {
      tableName : 'Contactos',
      timestamps: false
    });
  
    return Contacto;
};
  