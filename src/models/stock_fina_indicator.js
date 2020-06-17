/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stock_fina_indicator', {
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
    eps: {
      type: "DOUBLE",
      allowNull: true
    },
    dt_eps: {
      type: "DOUBLE",
      allowNull: true
    },
    total_revenue_ps: {
      type: "DOUBLE",
      allowNull: true
    },
    revenue_ps: {
      type: "DOUBLE",
      allowNull: true
    },
    capital_rese_ps: {
      type: "DOUBLE",
      allowNull: true
    },
    surplus_rese_ps: {
      type: "DOUBLE",
      allowNull: true
    },
    undist_profit_ps: {
      type: "DOUBLE",
      allowNull: true
    },
    extra_item: {
      type: "DOUBLE",
      allowNull: true
    },
    profit_dedt: {
      type: "DOUBLE",
      allowNull: true
    },
    gross_margin: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    current_ratio: {
      type: "DOUBLE",
      allowNull: true
    },
    quick_ratio: {
      type: "DOUBLE",
      allowNull: true
    },
    cash_ratio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ar_turn: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ca_turn: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fa_turn: {
      type: "DOUBLE",
      allowNull: true
    },
    assets_turn: {
      type: "DOUBLE",
      allowNull: true
    },
    op_income: {
      type: "DOUBLE",
      allowNull: true
    },
    ebit: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ebitda: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fcff: {
      type: "DOUBLE",
      allowNull: true
    },
    fcfe: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    current_exint: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    noncurrent_exint: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    interestdebt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    netdebt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tangible_asset: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    working_capital: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    networking_capital: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    invest_capital: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    retained_earnings: {
      type: "DOUBLE",
      allowNull: true
    },
    diluted2_eps: {
      type: "DOUBLE",
      allowNull: true
    },
    bps: {
      type: "DOUBLE",
      allowNull: true
    },
    ocfps: {
      type: "DOUBLE",
      allowNull: true
    },
    retainedps: {
      type: "DOUBLE",
      allowNull: true
    },
    cfps: {
      type: "DOUBLE",
      allowNull: true
    },
    ebit_ps: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fcff_ps: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fcfe_ps: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    netprofit_margin: {
      type: "DOUBLE",
      allowNull: true
    },
    grossprofit_margin: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cogs_of_sales: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    expense_of_sales: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    profit_to_gr: {
      type: "DOUBLE",
      allowNull: true
    },
    saleexp_to_gr: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    adminexp_of_gr: {
      type: "DOUBLE",
      allowNull: true
    },
    finaexp_of_gr: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    impai_ttm: {
      type: "DOUBLE",
      allowNull: true
    },
    gc_of_gr: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    op_of_gr: {
      type: "DOUBLE",
      allowNull: true
    },
    ebit_of_gr: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    roe: {
      type: "DOUBLE",
      allowNull: true
    },
    roe_waa: {
      type: "DOUBLE",
      allowNull: true
    },
    roe_dt: {
      type: "DOUBLE",
      allowNull: true
    },
    roa: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    npta: {
      type: "DOUBLE",
      allowNull: true
    },
    roic: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    roe_yearly: {
      type: "DOUBLE",
      allowNull: true
    },
    roa2_yearly: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    debt_to_assets: {
      type: "DOUBLE",
      allowNull: true
    },
    assets_to_eqt: {
      type: "DOUBLE",
      allowNull: true
    },
    dp_assets_to_eqt: {
      type: "DOUBLE",
      allowNull: true
    },
    ca_to_assets: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    nca_to_assets: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tbassets_to_totalassets: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    int_to_talcap: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    eqt_to_talcapital: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    currentdebt_to_debt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    longdeb_to_debt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ocf_to_shortdebt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    debt_to_eqt: {
      type: "DOUBLE",
      allowNull: true
    },
    eqt_to_debt: {
      type: "DOUBLE",
      allowNull: true
    },
    eqt_to_interestdebt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tangibleasset_to_debt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tangasset_to_intdebt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tangibleasset_to_netdebt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ocf_to_debt: {
      type: "DOUBLE",
      allowNull: true
    },
    turn_days: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    roa_yearly: {
      type: "DOUBLE",
      allowNull: true
    },
    roa_dp: {
      type: "DOUBLE",
      allowNull: true
    },
    fixed_assets: {
      type: "DOUBLE",
      allowNull: true
    },
    profit_to_op: {
      type: "DOUBLE",
      allowNull: true
    },
    q_saleexp_to_gr: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    q_gc_to_gr: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    q_roe: {
      type: "DOUBLE",
      allowNull: true
    },
    q_dt_roe: {
      type: "DOUBLE",
      allowNull: true
    },
    q_npta: {
      type: "DOUBLE",
      allowNull: true
    },
    q_ocf_to_sales: {
      type: "DOUBLE",
      allowNull: true
    },
    basic_eps_yoy: {
      type: "DOUBLE",
      allowNull: true
    },
    dt_eps_yoy: {
      type: "DOUBLE",
      allowNull: true
    },
    cfps_yoy: {
      type: "DOUBLE",
      allowNull: true
    },
    op_yoy: {
      type: "DOUBLE",
      allowNull: true
    },
    ebt_yoy: {
      type: "DOUBLE",
      allowNull: true
    },
    netprofit_yoy: {
      type: "DOUBLE",
      allowNull: true
    },
    dt_netprofit_yoy: {
      type: "DOUBLE",
      allowNull: true
    },
    ocf_yoy: {
      type: "DOUBLE",
      allowNull: true
    },
    roe_yoy: {
      type: "DOUBLE",
      allowNull: true
    },
    bps_yoy: {
      type: "DOUBLE",
      allowNull: true
    },
    assets_yoy: {
      type: "DOUBLE",
      allowNull: true
    },
    eqt_yoy: {
      type: "DOUBLE",
      allowNull: true
    },
    tr_yoy: {
      type: "DOUBLE",
      allowNull: true
    },
    or_yoy: {
      type: "DOUBLE",
      allowNull: true
    },
    q_sales_yoy: {
      type: "DOUBLE",
      allowNull: true
    },
    q_op_qoq: {
      type: "DOUBLE",
      allowNull: true
    },
    equity_yoy: {
      type: "DOUBLE",
      allowNull: true
    }
  }, {
    tableName: 'stock_fina_indicator'
  });
};
