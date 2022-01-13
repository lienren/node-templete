/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_users', {
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
    depId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    depName1: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    depName2: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    depStreet: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    idcard: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    tradeType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    postName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    periodType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sampWay: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    street: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    community: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    userType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sampStartTime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    sampName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sampUserName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sampHandleTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updateTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    isUp: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    upTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    upRep: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    restStartTime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    restEndTime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    tableName: 'info_users'
  });
};
