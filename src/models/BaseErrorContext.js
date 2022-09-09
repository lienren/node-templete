/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BaseErrorContext', {
    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    context: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    addtime: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'BaseErrorContext'
  });
};
