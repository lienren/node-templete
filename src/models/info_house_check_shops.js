const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_house_check_shops', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    a1: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "房屋坐落"
    },
    shopName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "店铺名称"
    },
    cType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "检查类型（经营性房产、集团办公楼）"
    },
    cUsers: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "检查人列表"
    },
    cContent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "检查内容"
    },
    cStatus: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "处理状态(待复查、已完成)"
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
    tableName: 'info_house_check_shops',
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
        name: "idx_cType",
        using: "BTREE",
        fields: [
          { name: "cType" },
        ]
      },
    ]
  });
};
