module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    id_token: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    token: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'Tokens',
    timestamps: false
  });
  return Token;
};