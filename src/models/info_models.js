const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_models', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    modelType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "车型"
    },
    modelNum: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "车牌"
    },
    modelCode: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "车牌Code"
    },
    modelImg: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "车辆照片"
    },
    modelStatus: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "车辆状态(待绑定、已绑定、待报废、已报废)"
    },
    bangTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "绑牌时间"
    },
    scrapRemark: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "报废通知"
    },
    scrapStartTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "报废开始时间"
    },
    scrapEndTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "报废结束时间"
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updateTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'info_models',
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
        name: "idx_userId",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
      {
        name: "idx_modelNum",
        using: "BTREE",
        fields: [
          { name: "modelNum" },
        ]
      },
      {
        name: "idx_modelCode",
        using: "BTREE",
        fields: [
          { name: "modelCode" },
        ]
      },
    ]
  });
};
