const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_notifys', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "用户编号"
    },
    modelId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "车辆编号"
    },
    manageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "管理员编号"
    },
    notifyType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "通知类型"
    },
    notifyContent: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "通知内容"
    },
    sendPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "通知号码"
    },
    isSend: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "是否发送"
    },
    sendTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "发送时间"
    },
    sendResult: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "发送结果"
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    isDel: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'info_notifys',
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
        name: "idx_notifyType",
        using: "BTREE",
        fields: [
          { name: "notifyType" },
        ]
      },
    ]
  });
};
