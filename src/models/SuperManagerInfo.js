/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SuperManagerInfo', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
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
      type: DataTypes.INTEGER(11),
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
      type: DataTypes.INTEGER(11),
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
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    verifyLevel: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    verifyType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    verifyVillages: {
      type: DataTypes.STRING(2000),
      allowNull: true
    }
  }, {
    tableName: 'SuperManagerInfo'
  });
};
