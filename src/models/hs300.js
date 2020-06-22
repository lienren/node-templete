/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hs300', {
    code: {
      type: DataTypes.STRING(40),
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.STRING(11),
      allowNull: false,
      primaryKey: true
    },
    symbol: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    weight: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    display_name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    ctime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatetime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'hs300'
  });
};
