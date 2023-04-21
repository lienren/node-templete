const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_warehouse_pro', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
      comment: "库存"
    },
    space_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "货位编号"
    },
    wh_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "库房编号"
    },
    wh_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "库房名称"
    },
    area_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "区位名称"
    },
    shelf_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "货架名称"
    },
    space_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "货位名称"
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
    pre_pro_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "预占库存"
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
    tableName: 'info_warehouse_pro',
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
        name: "idx_pro",
        using: "BTREE",
        fields: [
          { name: "pro_id" },
          { name: "space_id" },
          { name: "pc_id" },
        ]
      },
    ]
  });
};
