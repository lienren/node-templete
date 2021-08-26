/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('applyInfo', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    openId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    visitorUserName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    visitorIdcard: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    visitorPhone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    visitorCompany: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    visitorCampus: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    visitorTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    visitorEndTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    visitorDay: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    visitorCar: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    visitorDepartment: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    visitReason: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    img1: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    img2: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    img3: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    statusName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    verifyAdminId1: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    verifyAdminIdName1: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    verifyAdminIdOver: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    verifyAdminNameOver: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    verifyAdminId2: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    verifyAdminIdName2: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    verifyAdminIdOver2: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    verifyAdminNameOver2: {
      type: DataTypes.STRING(100),
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
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    visitorTimeNum: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    visitorEndTimeNum: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    veriyReason: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    parkingType: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    carInCome: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '1'
    },
    userType: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '1'
    },
    userTypeName: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: '自主申请'
    },
    checkQCode: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    img4: {
      type: DataTypes.STRING(1000),
      allowNull: true
    }
  }, {
    tableName: 'applyInfo'
  });
};
