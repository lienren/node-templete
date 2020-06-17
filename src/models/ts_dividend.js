/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ts_dividend', {
    ts_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    end_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ann_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    div_proc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    stk_div: {
      type: "DOUBLE",
      allowNull: true
    },
    stk_bo_rate: {
      type: "DOUBLE",
      allowNull: true
    },
    stk_co_rate: {
      type: "DOUBLE",
      allowNull: true
    },
    cash_div: {
      type: "DOUBLE",
      allowNull: true
    },
    cash_div_tax: {
      type: "DOUBLE",
      allowNull: true
    },
    record_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ex_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pay_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    div_listdate: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imp_ann_date: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'ts_dividend'
  });
};
