/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stock_basic', {
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
    ctime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cashflow: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    managetag: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    balancesheet: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    income: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    pledge_detail: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    top10_holders: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    pledge_stat: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    fina_indicator: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    fina_indicator_n: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    violation: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    devidend: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    qfq: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'stock_basic'
  });
};
