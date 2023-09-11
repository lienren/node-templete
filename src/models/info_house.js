const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_house', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sn: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "编号"
    },
    a1: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "房屋坐落"
    },
    a2: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "建筑面积"
    },
    a3: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "土地使用权面积（宗地面积）"
    },
    a4: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "是否自有房产"
    },
    a5: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "是否为行政事业单位房产"
    },
    a6: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "产权单位"
    },
    a7: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "是否两证齐全"
    },
    a8: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "土地证号"
    },
    a9: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "房产证号"
    },
    a10: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "不动产权证号"
    },
    a11: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "房屋用途"
    },
    a12: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "房屋用途备注"
    },
    a13: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "土地使用类型"
    },
    a14: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "是否抵押"
    },
    a15: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "抵押目的"
    },
    a16: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "抵押开始时间"
    },
    a17: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "抵押结束时间"
    },
    street: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "所在街道"
    },
    community: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "所在社区"
    },
    remark: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "备注"
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
    },
    isDel: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    lon: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "经度"
    },
    lat: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "纬度"
    },
    houseStatus: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "在册",
      comment: "房产状态（在册、核销）"
    },
    houseType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "产权类型（自有房产、代管街道办事处房产、代管政府部门房产）"
    },
    houseRelege: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "产权单位"
    },
    houseImg: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "房产照片"
    },
    a18: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "土地证照片"
    },
    a19: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "房产证照片"
    },
    a20: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "不动产权证照片"
    },
    a21: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "房屋来源"
    },
    a22: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "移交协议照片"
    }
  }, {
    sequelize,
    tableName: 'info_house',
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
        name: "idx_houseType",
        using: "BTREE",
        fields: [
          { name: "houseType" },
        ]
      },
      {
        name: "idx_houseRelege",
        using: "BTREE",
        fields: [
          { name: "houseRelege" },
        ]
      },
      {
        name: "idx_sn",
        using: "BTREE",
        fields: [
          { name: "sn" },
        ]
      },
    ]
  });
};
