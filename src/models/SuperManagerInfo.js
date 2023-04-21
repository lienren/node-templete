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
      defaultValue: 0
    },
    verifyType: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    verifyVillages: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    userType: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    userData: {
      type: DataTypes.STRING(500),
      allowNull: true
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
        name: "idx_userType",
        using: "BTREE",
        fields: [
          { name: "userType" },
        ]
      },
    ]
  });
};
