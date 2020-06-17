/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ts_pro_bar_qfq', {
    ts_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    trade_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    open: {
      type: "DOUBLE",
      allowNull: true
    },
    high: {
      type: "DOUBLE",
      allowNull: true
    },
    low: {
      type: "DOUBLE",
      allowNull: true
    },
    close: {
      type: "DOUBLE",
      allowNull: true
    },
    pre_close: {
      type: "DOUBLE",
      allowNull: true
    },
    change: {
      type: "DOUBLE",
      allowNull: true
    },
    pct_chg: {
      type: "DOUBLE",
      allowNull: true
    },
    vol: {
      type: "DOUBLE",
      allowNull: true
    },
    amount: {
      type: "DOUBLE",
      allowNull: true
    }
  }, {
    tableName: 'ts_pro_bar_qfq'
  });
};
