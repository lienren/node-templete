const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SuperManagerLoginfo', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pageName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pageUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    actionName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    eventName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    activeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    addTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    managerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    managerRealName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    managerLoginName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    managerPhone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    reqParam: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    reqTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    repParam: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    repTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'SuperManagerLoginfo',
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
    ]
  });
};
