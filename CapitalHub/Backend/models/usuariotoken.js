module.exports = (sequelize, DataTypes) => {
    const UsuarioToken = sequelize.define('UsuarioToken', {
        id        : { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        id_token  : { type: DataTypes.INTEGER, allowNull: false },
        id_usuario: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        tableName : 'UsuarioTokens',
        timestamps: false
    });
    return UsuarioToken;
};