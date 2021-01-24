/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BaseApi', {
    apiUrl: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      primaryKey: true
    },
    apiName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    apiShortName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    activeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    apiType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    isAuth: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    addTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'BaseApi'
  });
};
