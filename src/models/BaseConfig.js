/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BaseConfig', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    value: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    lasttime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    addtime: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'BaseConfig'
  });
};
