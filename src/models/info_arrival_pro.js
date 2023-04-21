const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_arrival_pro', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    al_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "入库单编号"
    },
    al_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "入库单编码"
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
      comment: "应入库数量"
    },
    pro_arrival_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "实际入库数量"
    },
    pro_arrival_detail: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "实际入库位置明细"
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
    tableName: 'info_arrival_pro',
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
          { name: "al_id" },
        ]
      },
      {
        name: "idx_pc_code",
        using: "BTREE",
        fields: [
          { name: "al_code" },
        ]
      },
    ]
  });
};
