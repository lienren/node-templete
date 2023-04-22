const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_outwh_pro', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    o_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "出库单编号"
    },
    o_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "出库单编码"
    },
    order_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "订单编号"
    },
    pro_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "商品编号"
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
      comment: "商品数量"
    },
    pro_out_status: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "出库状态（可出库、异常、已出库）"
    },
    pro_out_status_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "出库状态时间"
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
    },
    pro_out_status_desc: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "出库状态描述"
    }
  }, {
    sequelize,
    tableName: 'info_outwh_pro',
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
    ]
  });
};
