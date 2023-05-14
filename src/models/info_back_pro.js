const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_back_pro', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pc_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "退货单编号"
    },
    pc_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "退货单编码"
    },
    order_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "订单号"
    },
    pro_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "商品编号"
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
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "单位"
    },
    pro_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "订购数量"
    },
    pro_back_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "退货数量"
    },
    pro_arrival_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "已到货数量"
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
    tableName: 'info_back_pro',
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
        name: "idx_pc_id",
        using: "BTREE",
        fields: [
          { name: "pc_id" },
        ]
      },
      {
        name: "idx_pc_code",
        using: "BTREE",
        fields: [
          { name: "pc_code" },
        ]
      },
    ]
  });
};
