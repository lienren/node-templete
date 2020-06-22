/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('manual_clinet_top5income_rate', {
    id: {
      type: DataTypes.INTEGER(20).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ts_code: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    rate_2012: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    rate_2013: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    rate_2014: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    rate_2015: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    rate_2016: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    rate_2017: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    rate_2018: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    rate_2019: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    updatetime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ctime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'manual_clinet_top5income_rate'
  });
};
