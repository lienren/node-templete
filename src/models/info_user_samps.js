const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_user_samps', {
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
    startTime: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "应采样开始时间"
    },
    endTime: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "应采样结束时间"
    },
    dayCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "应采样天数"
    },
    realCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "应采样次数"
    },
    postName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "职业名称"
    },
    periodType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "采样周期类型"
    },
    sampWay: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "采样方式"
    },
    handleType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "采样类型（未采样、已采样、个人上传采样）"
    },
    handleTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "采样时间"
    },
    handleCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "实际采样次数"
    },
    sampName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "采样点"
    },
    sampUserName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "采样人"
    },
    imgUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "自行上传图片"
    },
    imgTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "上传时间"
    },
    remark: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "备注"
    },
    isSend: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "是否发送，0未发送，1已发送"
    },
    sendTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "发送时间"
    },
    sendRep: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "发送结果"
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
    },
    isPlan: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "计划外",
      comment: "是否计划内"
    }
  }, {
    sequelize,
    tableName: 'info_user_samps',
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
        name: "idx_handleType",
        using: "BTREE",
        fields: [
          { name: "handleType" },
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
        name: "idx_handleTime",
        using: "BTREE",
        fields: [
          { name: "handleTime" },
        ]
      },
      {
        name: "idx_sampName",
        using: "BTREE",
        fields: [
          { name: "sampName" },
        ]
      },
      {
        name: "idx_startTime",
        using: "BTREE",
        fields: [
          { name: "startTime" },
        ]
      },
      {
        name: "idx_endTime",
        using: "BTREE",
        fields: [
          { name: "endTime" },
        ]
      },
      {
        name: "idx_postName",
        using: "BTREE",
        fields: [
          { name: "postName" },
        ]
      },
    ]
  });
};
