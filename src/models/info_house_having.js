const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_house_having', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    hid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "房屋编号"
    },
    a1: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "目前状态（出租、出借）"
    },
    a2: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "承租方"
    },
    a3: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      comment: "年租金"
    },
    a4: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      comment: "保证金"
    },
    a5: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "收款方式"
    },
    a6: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "下一期收款提醒"
    },
    a7: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "出租面积"
    },
    a8: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "租赁开始时间"
    },
    a9: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "租赁结束时间"
    },
    a10: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "使用单位"
    },
    a11: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "出借面积"
    },
    a12: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "否",
      comment: "是否为行政事业单位办公用房"
    },
    a13: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "若使用情况为其他（说明原因）"
    },
    a14: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "出租年数"
    },
    a15: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "租赁合同编号"
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    modifyTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'info_house_having',
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
        name: "idx_a1",
        using: "BTREE",
        fields: [
          { name: "a1" },
        ]
      },
    ]
  });
};
