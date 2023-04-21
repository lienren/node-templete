const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_purchase', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pc_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "采购单编码"
    },
    pc_desc: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "采购单描述"
    },
    pc_uname: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "采购人"
    },
    pc_utime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "采购时间"
    },
    pc_plan_arrival: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "计划到货日期"
    },
    pc_pro_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "商品种类数量"
    },
    pc_pro_total_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "商品采购总数量"
    },
    pc_pro_total_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      comment: "商品采购单总价"
    },
    pc_pro_arrival_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "商品到货总数量"
    },
    pc_status: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "采购单状态（未下单、已采购、全部到货、部分到货）"
    },
    pc_status_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "采购单状态变更时间"
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
    tableName: 'info_purchase',
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
        name: "idx_pc_code",
        using: "BTREE",
        fields: [
          { name: "pc_code" },
        ]
      },
      {
        name: "idx_pc_uname",
        using: "BTREE",
        fields: [
          { name: "pc_uname" },
        ]
      },
      {
        name: "idx_pc_utime",
        using: "BTREE",
        fields: [
          { name: "pc_utime" },
        ]
      },
      {
        name: "idx_pc_plan_arrival",
        using: "BTREE",
        fields: [
          { name: "pc_plan_arrival" },
        ]
      },
      {
        name: "idx_pc_status",
        using: "BTREE",
        fields: [
          { name: "pc_status" },
        ]
      },
    ]
  });
};
