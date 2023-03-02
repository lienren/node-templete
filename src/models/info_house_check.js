const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_house_check', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    hid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "房产编号"
    },
    a1: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "房屋坐落"
    },
    cType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "检查类型（经营性房产、集团办公楼）"
    },
    cUsers: {
      type: DataTypes.STRING(2000),
      allowNull: true,
      comment: "检查人列表"
    },
    cUserIds: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "检查人编号列表"
    },
    cContent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "检查内容"
    },
    cStatus: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "处理状态(未处理、处理中、已完成)"
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
    tableName: 'info_house_check',
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
        name: "idx_hid",
        using: "BTREE",
        fields: [
          { name: "hid" },
        ]
      },
      {
        name: "idx_cStatus",
        using: "BTREE",
        fields: [
          { name: "cStatus" },
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
