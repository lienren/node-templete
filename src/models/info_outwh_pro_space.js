const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_outwh_pro_space', {
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
      comment: "商品单位"
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
    pro_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "拣货数量"
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
    tableName: 'info_outwh_pro_space',
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
