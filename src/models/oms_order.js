/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('oms_order', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    member_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    coupon_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    order_sn: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    member_username: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    total_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    pay_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    freight_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    promotion_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    integration_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    coupon_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    discount_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    pay_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    source_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    order_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    delivery_company: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    delivery_sn: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    auto_confirm_day: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    integration: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    growth: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    promotion_info: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    bill_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    bill_header: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    bill_content: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    bill_receiver_phone: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    bill_receiver_email: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    receiver_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    receiver_phone: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    receiver_post_code: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    receiver_province: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    receiver_city: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    receiver_region: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    receiver_detail_address: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    note: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    confirm_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    delete_status: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    use_integration: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    payment_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    delivery_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    receive_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    comment_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    modify_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bill_sort: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: '不开票'
    },
    bill_company_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    bill_tax: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    bill_account_bank: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    bill_account_num: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    bill_address: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    tableName: 'oms_order'
  });
};
