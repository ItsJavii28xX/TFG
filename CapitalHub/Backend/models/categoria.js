module.exports = (sequelize, DataTypes) => {
    const Categoria = sequelize.define('Categoria', {
      id_categoria: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      nombre      : DataTypes.STRING,
      descripcion : DataTypes.TEXT
    }, {
      tableName : 'Categorias',
      timestamps: false
    });
  
    return Categoria;
};
  