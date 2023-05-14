const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_arrival', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    al_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "入库单编码"
    },
    al_desc: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "入库单描述"
    },
    al_pro_total_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "入库总数量"
    },
    al_type: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "采购入库单",
      comment: "入库类型（采购入库单、退货入库单）"
    },
    al_status: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "入库单状态（未入库、部分入库、全部入库）"
    },
    al_status_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "入库单状态变更时间"
    },
    pc_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "采购单编号"
    },
    pc_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "采购单编码"
    },
    al_uname: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "创建入库单人员"
    },
    al_arrival_uname: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "入库人员"
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
    tableName: 'info_arrival',
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
