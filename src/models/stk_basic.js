/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stk_basic', {
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
    industry: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    fullname: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    market: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    list_date: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    is_hs: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    list_status: {
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
    tableName: 'stk_basic'
  });
};
