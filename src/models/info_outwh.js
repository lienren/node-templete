const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_outwh', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    o_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "出库单编号"
    },
    o_order_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "订单数量"
    },
    o_pro_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "商品数量"
    },
    o_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "出库单状态（未出库、拣货中、已出库）"
    },
    o_status_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "出库单状态时间"
    },
    o_uname: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "出库人"
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
    tableName: 'info_outwh',
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
