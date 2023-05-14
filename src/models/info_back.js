const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_back', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pc_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "退货单编码"
    },
    pc_desc: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "退货单描述"
    },
    pc_uname: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "制单人"
    },
    pc_utime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "制单时间"
    },
    pc_pro_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "商品种类数量"
    },
    pc_pro_total_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "商品退货总数量"
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
      comment: "退货单状态（未下单、退货中、全部到货、部分到货）"
    },
    pc_status_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "退货单状态变更时间"
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
    tableName: 'info_back',
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
        name: "idx_pc_status",
        using: "BTREE",
        fields: [
          { name: "pc_status" },
        ]
      },
    ]
  });
};
