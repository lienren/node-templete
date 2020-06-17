/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stock_income', {
    ts_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ann_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    f_ann_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    end_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    report_type: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    comp_type: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    basic_eps: {
      type: "DOUBLE",
      allowNull: true
    },
    diluted_eps: {
      type: "DOUBLE",
      allowNull: true
    },
    total_revenue: {
      type: "DOUBLE",
      allowNull: true
    },
    revenue: {
      type: "DOUBLE",
      allowNull: true
    },
    int_income: {
      type: "DOUBLE",
      allowNull: true
    },
    prem_earned: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    comm_income: {
      type: "DOUBLE",
      allowNull: true
    },
    n_commis_income: {
      type: "DOUBLE",
      allowNull: true
    },
    n_oth_income: {
      type: "DOUBLE",
      allowNull: true
    },
    n_oth_b_income: {
      type: "DOUBLE",
      allowNull: true
    },
    prem_income: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    out_prem: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    une_prem_reser: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reins_income: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    n_sec_tb_income: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    n_sec_uw_income: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    n_asset_mg_income: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    oth_b_income: {
      type: "DOUBLE",
      allowNull: true
    },
    fv_value_chg_gain: {
      type: "DOUBLE",
      allowNull: true
    },
    invest_income: {
      type: "DOUBLE",
      allowNull: true
    },
    ass_invest_income: {
      type: "DOUBLE",
      allowNull: true
    },
    forex_gain: {
      type: "DOUBLE",
      allowNull: true
    },
    total_cogs: {
      type: "DOUBLE",
      allowNull: true
    },
    oper_cost: {
      type: "DOUBLE",
      allowNull: true
    },
    int_exp: {
      type: "DOUBLE",
      allowNull: true
    },
    comm_exp: {
      type: "DOUBLE",
      allowNull: true
    },
    biz_tax_surchg: {
      type: "DOUBLE",
      allowNull: true
    },
    sell_exp: {
      type: "DOUBLE",
      allowNull: true
    },
    admin_exp: {
      type: "DOUBLE",
      allowNull: true
    },
    fin_exp: {
      type: "DOUBLE",
      allowNull: true
    },
    assets_impair_loss: {
      type: "DOUBLE",
      allowNull: true
    },
    prem_refund: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    compens_payout: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reser_insur_liab: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    div_payt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reins_exp: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    oper_exp: {
      type: "DOUBLE",
      allowNull: true
    },
    compens_payout_refu: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    insur_reser_refu: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reins_cost_refund: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    other_bus_cost: {
      type: "DOUBLE",
      allowNull: true
    },
    operate_profit: {
      type: "DOUBLE",
      allowNull: true
    },
    non_oper_income: {
      type: "DOUBLE",
      allowNull: true
    },
    non_oper_exp: {
      type: "DOUBLE",
      allowNull: true
    },
    nca_disploss: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    total_profit: {
      type: "DOUBLE",
      allowNull: true
    },
    income_tax: {
      type: "DOUBLE",
      allowNull: true
    },
    n_income: {
      type: "DOUBLE",
      allowNull: true
    },
    n_income_attr_p: {
      type: "DOUBLE",
      allowNull: true
    },
    minority_gain: {
      type: "DOUBLE",
      allowNull: true
    },
    oth_compr_income: {
      type: "DOUBLE",
      allowNull: true
    },
    t_compr_income: {
      type: "DOUBLE",
      allowNull: true
    },
    compr_inc_attr_p: {
      type: "DOUBLE",
      allowNull: true
    },
    compr_inc_attr_m_s: {
      type: "DOUBLE",
      allowNull: true
    },
    ebit: {
      type: "DOUBLE",
      allowNull: true
    },
    ebitda: {
      type: "DOUBLE",
      allowNull: true
    },
    insurance_exp: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    undist_profit: {
      type: "DOUBLE",
      allowNull: true
    },
    distable_profit: {
      type: "DOUBLE",
      allowNull: true
    }
  }, {
    tableName: 'stock_income'
  });
};
