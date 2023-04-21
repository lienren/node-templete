const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_purchase_pro', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pc_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "采购单编号"
    },
    pc_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "采购单编码"
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
      comment: "采购数量"
    },
    pro_pc_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00,
      comment: "采购单价"
    },
    pro_pc_total_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00,
      comment: "采购总价"
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
    tableName: 'info_purchase_pro',
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
