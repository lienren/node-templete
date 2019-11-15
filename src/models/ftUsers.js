/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ftUsers', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    alipayUserId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    nickName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userPhone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    headImg: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    addTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updateTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    userType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    userTypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userIdCard: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    pName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    cName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    siteName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sitePosition: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    siteAddress: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sitePickAddress: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    verifyType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    verifyTypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    verfiyRemark: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    verifyTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    currGId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    currGName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    currGTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    token: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    tokenOverTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'ftUsers'
  });
};
