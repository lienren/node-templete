/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stock_balancesheet', {
    ts_code: {
      type: DataTypes.STRING(255),
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
    total_share: {
      type: "DOUBLE",
      allowNull: true
    },
    cap_rese: {
      type: "DOUBLE",
      allowNull: true
    },
    undistr_porfit: {
      type: "DOUBLE",
      allowNull: true
    },
    surplus_rese: {
      type: "DOUBLE",
      allowNull: true
    },
    special_rese: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    money_cap: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    trad_asset: {
      type: "DOUBLE",
      allowNull: true
    },
    notes_receiv: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    accounts_receiv: {
      type: "DOUBLE",
      allowNull: true
    },
    oth_receiv: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    prepayment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    div_receiv: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    int_receiv: {
      type: "DOUBLE",
      allowNull: true
    },
    inventories: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    amor_exp: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    nca_within_1y: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sett_rsrv: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    loanto_oth_bank_fi: {
      type: "DOUBLE",
      allowNull: true
    },
    premium_receiv: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reinsur_receiv: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reinsur_res_receiv: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pur_resale_fa: {
      type: "DOUBLE",
      allowNull: true
    },
    oth_cur_assets: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    total_cur_assets: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fa_avail_for_sale: {
      type: "DOUBLE",
      allowNull: true
    },
    htm_invest: {
      type: "DOUBLE",
      allowNull: true
    },
    lt_eqt_invest: {
      type: "DOUBLE",
      allowNull: true
    },
    invest_real_estate: {
      type: "DOUBLE",
      allowNull: true
    },
    time_deposits: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    oth_assets: {
      type: "DOUBLE",
      allowNull: true
    },
    lt_rec: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fix_assets: {
      type: "DOUBLE",
      allowNull: true
    },
    cip: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    const_materials: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fixed_assets_disp: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    produc_bio_assets: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    oil_and_gas_assets: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    intan_assets: {
      type: "DOUBLE",
      allowNull: true
    },
    r_and_d: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    goodwill: {
      type: "DOUBLE",
      allowNull: true
    },
    lt_amor_exp: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    defer_tax_assets: {
      type: "DOUBLE",
      allowNull: true
    },
    decr_in_disbur: {
      type: "DOUBLE",
      allowNull: true
    },
    oth_nca: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    total_nca: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cash_reser_cb: {
      type: "DOUBLE",
      allowNull: true
    },
    depos_in_oth_bfi: {
      type: "DOUBLE",
      allowNull: true
    },
    prec_metals: {
      type: "DOUBLE",
      allowNull: true
    },
    deriv_assets: {
      type: "DOUBLE",
      allowNull: true
    },
    rr_reins_une_prem: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rr_reins_outstd_cla: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rr_reins_lins_liab: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rr_reins_lthins_liab: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    refund_depos: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ph_pledge_loans: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    refund_cap_depos: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    indep_acct_assets: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    client_depos: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    client_prov: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    transac_seat_fee: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    invest_as_receiv: {
      type: "DOUBLE",
      allowNull: true
    },
    total_assets: {
      type: "DOUBLE",
      allowNull: true
    },
    lt_borr: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    st_borr: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cb_borr: {
      type: "DOUBLE",
      allowNull: true
    },
    depos_ib_deposits: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    loan_oth_bank: {
      type: "DOUBLE",
      allowNull: true
    },
    trading_fl: {
      type: "DOUBLE",
      allowNull: true
    },
    notes_payable: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    acct_payable: {
      type: "DOUBLE",
      allowNull: true
    },
    adv_receipts: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sold_for_repur_fa: {
      type: "DOUBLE",
      allowNull: true
    },
    comm_payable: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    payroll_payable: {
      type: "DOUBLE",
      allowNull: true
    },
    taxes_payable: {
      type: "DOUBLE",
      allowNull: true
    },
    int_payable: {
      type: "DOUBLE",
      allowNull: true
    },
    div_payable: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    oth_payable: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    acc_exp: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    deferred_inc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    st_bonds_payable: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    payable_to_reinsurer: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rsrv_insur_cont: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    acting_trading_sec: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    acting_uw_sec: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    non_cur_liab_due_1y: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    oth_cur_liab: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    total_cur_liab: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bond_payable: {
      type: "DOUBLE",
      allowNull: true
    },
    lt_payable: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    specific_payables: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estimated_liab: {
      type: "DOUBLE",
      allowNull: true
    },
    defer_tax_liab: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    defer_inc_non_cur_liab: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    oth_ncl: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    total_ncl: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    depos_oth_bfi: {
      type: "DOUBLE",
      allowNull: true
    },
    deriv_liab: {
      type: "DOUBLE",
      allowNull: true
    },
    depos: {
      type: "DOUBLE",
      allowNull: true
    },
    agency_bus_liab: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    oth_liab: {
      type: "DOUBLE",
      allowNull: true
    },
    prem_receiv_adva: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    depos_received: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ph_invest: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reser_une_prem: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reser_outstd_claims: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reser_lins_liab: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reser_lthins_liab: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    indept_acc_liab: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pledge_borr: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    indem_payable: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    policy_div_payable: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    total_liab: {
      type: "DOUBLE",
      allowNull: true
    },
    treasury_share: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ordin_risk_reser: {
      type: "DOUBLE",
      allowNull: true
    },
    forex_differ: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    invest_loss_unconf: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    minority_int: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    total_hldr_eqy_exc_min_int: {
      type: "DOUBLE",
      allowNull: true
    },
    total_hldr_eqy_inc_min_int: {
      type: "DOUBLE",
      allowNull: true
    },
    total_liab_hldr_eqy: {
      type: "DOUBLE",
      allowNull: true
    },
    lt_payroll_payable: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    oth_comp_income: {
      type: "DOUBLE",
      allowNull: true
    },
    oth_eqt_tools: {
      type: "DOUBLE",
      allowNull: true
    },
    oth_eqt_tools_p_shr: {
      type: "DOUBLE",
      allowNull: true
    },
    lending_funds: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    acc_receivable: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    st_fin_payable: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    payables: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hfs_assets: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hfs_sales: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'stock_balancesheet'
  });
};
