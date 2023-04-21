const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_pro', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pro_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "商品名称"
    },
    sort_first: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "分类一级"
    },
    sort_second: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "分类二级"
    },
    pro_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "商品编码"
    },
    pro_brand: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "品牌名称"
    },
    pro_unit: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "单位"
    },
    pro_supplier: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "供应商"
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
    tableName: 'info_pro',
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
        name: "idx_pro_name",
        using: "BTREE",
        fields: [
          { name: "pro_name" },
        ]
      },
      {
        name: "idx_sort_first",
        using: "BTREE",
        fields: [
          { name: "sort_first" },
        ]
      },
      {
        name: "idx_sort_second",
        using: "BTREE",
        fields: [
          { name: "sort_second" },
        ]
      },
      {
        name: "idx_pro_code",
        using: "BTREE",
        fields: [
          { name: "pro_code" },
        ]
      },
      {
        name: "idx_pro_brand",
        using: "BTREE",
        fields: [
          { name: "pro_brand" },
        ]
      },
      {
        name: "idx_pro_supplier",
        using: "BTREE",
        fields: [
          { name: "pro_supplier" },
        ]
      },
    ]
  });
};
