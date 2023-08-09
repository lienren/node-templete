const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_rebate_order', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    re_user: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "返利用户"
    },
    re_user_phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "返利用户手机号"
    },
    re_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "返利天"
    },
    out_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "商户Id"
    },
    out_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "商户编码"
    },
    account: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "商户帐号"
    },
    account_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "商户名称"
    },
    order_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "订单号"
    },
    pro_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "商品编码"
    },
    pro_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "商品名称"
    },
    pro_unit: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "商品单位"
    },
    pro_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "商品数量"
    },
    rebate_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      comment: "返利金额"
    },
    is_del: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "是否删除"
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'info_rebate_order',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "idx_re_user",
        using: "BTREE",
        fields: [
          { name: "re_user" },
        ]
      },
      {
        name: "idx_re_date",
        using: "BTREE",
        fields: [
          { name: "re_date" },
        ]
      },
      {
        name: "idx_order_sn",
        using: "BTREE",
        fields: [
          { name: "order_code" },
        ]
      },
      {
        name: "idx_re_user_phone",
        using: "BTREE",
        fields: [
          { name: "re_user_phone" },
        ]
      },
    ]
  });
};
