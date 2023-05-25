const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_backfactory', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bf_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "返厂单编码"
    },
    bf_desc: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "返厂单描述"
    },
    bf_uname: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "制单人"
    },
    bf_utime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "制单时间"
    },
    bf_pro_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "商品种类数量"
    },
    bf_pro_total_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "商品返厂总数量"
    },
    bf_status: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "返厂单状态（未下单、拣货中、已出库、已返厂）"
    },
    bf_status_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "返厂单状态变更时间"
    },
    bf_express_company: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "物流公司"
    },
    bf_express_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "物流单号"
    },
    bf_express_sendtime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "物流发送时间"
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
    tableName: 'info_backfactory',
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
          { name: "bf_code" },
        ]
      },
      {
        name: "idx_pc_uname",
        using: "BTREE",
        fields: [
          { name: "bf_uname" },
        ]
      },
      {
        name: "idx_pc_utime",
        using: "BTREE",
        fields: [
          { name: "bf_utime" },
        ]
      },
      {
        name: "idx_pc_status",
        using: "BTREE",
        fields: [
          { name: "bf_status" },
        ]
      },
    ]
  });
};
