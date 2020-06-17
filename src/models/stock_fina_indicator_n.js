/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stock_fina_indicator_n', {
    ts_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ann_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    end_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    invturn_days: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    arturn_days: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    inv_turn: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    valuechange_income: {
      type: "DOUBLE",
      allowNull: true
    },
    interst_income: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    daa: {
      type: "DOUBLE",
      allowNull: true
    },
    roe_avg: {
      type: "DOUBLE",
      allowNull: true
    },
    opincome_of_ebt: {
      type: "DOUBLE",
      allowNull: true
    },
    investincome_of_ebt: {
      type: "DOUBLE",
      allowNull: true
    },
    n_op_profit_of_ebt: {
      type: "DOUBLE",
      allowNull: true
    },
    tax_to_ebt: {
      type: "DOUBLE",
      allowNull: true
    },
    dtprofit_to_profit: {
      type: "DOUBLE",
      allowNull: true
    },
    salescash_to_or: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ocf_to_or: {
      type: "DOUBLE",
      allowNull: true
    },
    ocf_to_opincome: {
      type: "DOUBLE",
      allowNull: true
    },
    capitalized_to_da: {
      type: "DOUBLE",
      allowNull: true
    },
    ocf_to_interestdebt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ocf_to_netdebt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ebit_to_interest: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    longdebt_to_workingcapital: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ebitda_to_debt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    profit_prefin_exp: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    non_op_profit: {
      type: "DOUBLE",
      allowNull: true
    },
    op_to_ebt: {
      type: "DOUBLE",
      allowNull: true
    },
    nop_to_ebt: {
      type: "DOUBLE",
      allowNull: true
    },
    ocf_to_profit: {
      type: "DOUBLE",
      allowNull: true
    },
    cash_to_liqdebt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cash_to_liqdebt_withinterest: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    op_to_liqdebt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    op_to_debt: {
      type: "DOUBLE",
      allowNull: true
    },
    roic_yearly: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    total_fa_trun: {
      type: "DOUBLE",
      allowNull: true
    },
    q_opincome: {
      type: "DOUBLE",
      allowNull: true
    },
    q_investincome: {
      type: "DOUBLE",
      allowNull: true
    },
    q_dtprofit: {
      type: "DOUBLE",
      allowNull: true
    },
    q_eps: {
      type: "DOUBLE",
      allowNull: true
    },
    q_netprofit_margin: {
      type: "DOUBLE",
      allowNull: true
    },
    q_gsprofit_margin: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    q_exp_to_sales: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    q_profit_to_gr: {
      type: "DOUBLE",
      allowNull: true
    },
    q_adminexp_to_gr: {
      type: "DOUBLE",
      allowNull: true
    },
    q_finaexp_to_gr: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    q_impair_to_gr_ttm: {
      type: "DOUBLE",
      allowNull: true
    },
    q_op_to_gr: {
      type: "DOUBLE",
      allowNull: true
    },
    q_opincome_to_ebt: {
      type: "DOUBLE",
      allowNull: true
    },
    q_investincome_to_ebt: {
      type: "DOUBLE",
      allowNull: true
    },
    q_dtprofit_to_profit: {
      type: "DOUBLE",
      allowNull: true
    },
    q_salescash_to_or: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    q_ocf_to_or: {
      type: "DOUBLE",
      allowNull: true
    },
    q_gr_yoy: {
      type: "DOUBLE",
      allowNull: true
    },
    q_gr_qoq: {
      type: "DOUBLE",
      allowNull: true
    },
    q_sales_qoq: {
      type: "DOUBLE",
      allowNull: true
    },
    q_op_yoy: {
      type: "DOUBLE",
      allowNull: true
    },
    q_profit_yoy: {
      type: "DOUBLE",
      allowNull: true
    },
    q_profit_qoq: {
      type: "DOUBLE",
      allowNull: true
    },
    q_netprofit_yoy: {
      type: "DOUBLE",
      allowNull: true
    },
    q_netprofit_qoq: {
      type: "DOUBLE",
      allowNull: true
    },
    rd_exp: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    update_flag: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'stock_fina_indicator_n'
  });
};
