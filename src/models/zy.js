/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('zy', {
    x1: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    x2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    x3: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    x4: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    x5: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'zy'
  });
};
