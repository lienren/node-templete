/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stock_cashflow_copy', {
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
    comp_type: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    report_type: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    net_profit: {
      type: "DOUBLE",
      allowNull: true
    },
    finan_exp: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    c_fr_sale_sg: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    recp_tax_rends: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    n_depos_incr_fi: {
      type: "DOUBLE",
      allowNull: true
    },
    n_incr_loans_cb: {
      type: "DOUBLE",
      allowNull: true
    },
    n_inc_borr_oth_fi: {
      type: "DOUBLE",
      allowNull: true
    },
    prem_fr_orig_contr: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    n_incr_insured_dep: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    n_reinsur_prem: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    n_incr_disp_tfa: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ifc_cash_incr: {
      type: "DOUBLE",
      allowNull: true
    },
    n_incr_disp_faas: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    n_incr_loans_oth_bank: {
      type: "DOUBLE",
      allowNull: true
    },
    n_cap_incr_repur: {
      type: "DOUBLE",
      allowNull: true
    },
    c_fr_oth_operate_a: {
      type: "DOUBLE",
      allowNull: true
    },
    c_inf_fr_operate_a: {
      type: "DOUBLE",
      allowNull: true
    },
    c_paid_goods_s: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    c_paid_to_for_empl: {
      type: "DOUBLE",
      allowNull: true
    },
    c_paid_for_taxes: {
      type: "DOUBLE",
      allowNull: true
    },
    n_incr_clt_loan_adv: {
      type: "DOUBLE",
      allowNull: true
    },
    n_incr_dep_cbob: {
      type: "DOUBLE",
      allowNull: true
    },
    c_pay_claims_orig_inco: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pay_handling_chrg: {
      type: "DOUBLE",
      allowNull: true
    },
    pay_comm_insur_plcy: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    oth_cash_pay_oper_act: {
      type: "DOUBLE",
      allowNull: true
    },
    st_cash_out_act: {
      type: "DOUBLE",
      allowNull: true
    },
    n_cashflow_act: {
      type: "DOUBLE",
      allowNull: true
    },
    oth_recp_ral_inv_act: {
      type: "DOUBLE",
      allowNull: true
    },
    c_disp_withdrwl_invest: {
      type: "DOUBLE",
      allowNull: true
    },
    c_recp_return_invest: {
      type: "DOUBLE",
      allowNull: true
    },
    n_recp_disp_fiolta: {
      type: "DOUBLE",
      allowNull: true
    },
    n_recp_disp_sobu: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    stot_inflows_inv_act: {
      type: "DOUBLE",
      allowNull: true
    },
    c_pay_acq_const_fiolta: {
      type: "DOUBLE",
      allowNull: true
    },
    c_paid_invest: {
      type: "DOUBLE",
      allowNull: true
    },
    n_disp_subs_oth_biz: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    oth_pay_ral_inv_act: {
      type: "DOUBLE",
      allowNull: true
    },
    n_incr_pledge_loan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    stot_out_inv_act: {
      type: "DOUBLE",
      allowNull: true
    },
    n_cashflow_inv_act: {
      type: "DOUBLE",
      allowNull: true
    },
    c_recp_borrow: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    proc_issue_bonds: {
      type: "DOUBLE",
      allowNull: true
    },
    oth_cash_recp_ral_fnc_act: {
      type: "DOUBLE",
      allowNull: true
    },
    stot_cash_in_fnc_act: {
      type: "DOUBLE",
      allowNull: true
    },
    free_cashflow: {
      type: "DOUBLE",
      allowNull: true
    },
    c_prepay_amt_borr: {
      type: "DOUBLE",
      allowNull: true
    },
    c_pay_dist_dpcp_int_exp: {
      type: "DOUBLE",
      allowNull: true
    },
    incl_dvd_profit_paid_sc_ms: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    oth_cashpay_ral_fnc_act: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    stot_cashout_fnc_act: {
      type: "DOUBLE",
      allowNull: true
    },
    n_cash_flows_fnc_act: {
      type: "DOUBLE",
      allowNull: true
    },
    eff_fx_flu_cash: {
      type: "DOUBLE",
      allowNull: true
    },
    n_incr_cash_cash_equ: {
      type: "DOUBLE",
      allowNull: true
    },
    c_cash_equ_beg_period: {
      type: "DOUBLE",
      allowNull: true
    },
    c_cash_equ_end_period: {
      type: "DOUBLE",
      allowNull: true
    },
    c_recp_cap_contrib: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    incl_cash_rec_saims: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    uncon_invest_loss: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    prov_depr_assets: {
      type: "DOUBLE",
      allowNull: true
    },
    depr_fa_coga_dpba: {
      type: "DOUBLE",
      allowNull: true
    },
    amort_intang_assets: {
      type: "DOUBLE",
      allowNull: true
    },
    lt_amort_deferred_exp: {
      type: "DOUBLE",
      allowNull: true
    },
    decr_deferred_exp: {
      type: "DOUBLE",
      allowNull: true
    },
    incr_acc_exp: {
      type: "DOUBLE",
      allowNull: true
    },
    loss_disp_fiolta: {
      type: "DOUBLE",
      allowNull: true
    },
    loss_scr_fa: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    loss_fv_chg: {
      type: "DOUBLE",
      allowNull: true
    },
    invest_loss: {
      type: "DOUBLE",
      allowNull: true
    },
    decr_def_inc_tax_assets: {
      type: "DOUBLE",
      allowNull: true
    },
    incr_def_inc_tax_liab: {
      type: "DOUBLE",
      allowNull: true
    },
    decr_inventories: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    decr_oper_payable: {
      type: "DOUBLE",
      allowNull: true
    },
    incr_oper_payable: {
      type: "DOUBLE",
      allowNull: true
    },
    others: {
      type: "DOUBLE",
      allowNull: true
    },
    im_net_cashflow_oper_act: {
      type: "DOUBLE",
      allowNull: true
    },
    conv_debt_into_cap: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    conv_copbonds_due_within_1y: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fa_fnc_leases: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    end_bal_cash: {
      type: "DOUBLE",
      allowNull: true
    },
    beg_bal_cash: {
      type: "DOUBLE",
      allowNull: true
    },
    end_bal_cash_equ: {
      type: "DOUBLE",
      allowNull: true
    },
    beg_bal_cash_equ: {
      type: "DOUBLE",
      allowNull: true
    },
    im_n_incr_cash_equ: {
      type: "DOUBLE",
      allowNull: true
    }
  }, {
    tableName: 'stock_cashflow_copy'
  });
};
