/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('jq_stock_industry', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ts_code: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    symbol: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    area: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    fullname: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    level_first_name: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    level_first_id: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    level_second_name: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    level_second_id: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    level_third_name: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    level_third_id: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    zjh_name: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    zjh_id: {
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
    tableName: 'jq_stock_industry'
  });
};
