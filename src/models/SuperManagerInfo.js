const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SuperManagerInfo', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    openId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    loginName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    loginPwd: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    realName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    salt: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    state: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    token: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    tokenOverTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    sex: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    depName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    addTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    lastTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    verifyLevel: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "审核级别"
    },
    verifyType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "审核类型（物业、社区、街道、委办局）"
    },
    verifyVillages: {
      type: DataTypes.STRING(2000),
      allowNull: true,
      comment: "审核小区编号JSON"
    }
  }, {
    sequelize,
    tableName: 'SuperManagerInfo',
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
        name: "idx_openId",
        using: "BTREE",
        fields: [
          { name: "openId" },
        ]
      },
      {
        name: "idx_depName",
        using: "BTREE",
        fields: [
          { name: "depName" },
        ]
      },
    ]
  });
};
