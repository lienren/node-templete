/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BSLoanOrder', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    orderSn: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    userName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userSex: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userPhone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userIdCard: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userChannel: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userSource: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userSourceName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userSourceUserName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userSourcePhone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    loanPrice: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    loanInterest: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    loanServicePrice: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    loanTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    shouldReturnTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    managerId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    managerName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    managerPhone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    state: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    stateName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    extCount: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    extPrice: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    extReturnTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    realReturnPrice: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    realReturnTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    lastRemark: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    addTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    updateTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    lastloanPrice: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    lastloanInterest: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    lastloanServicePrice: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    isVerfiy: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    verfiyManagerId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    verfiyManager: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    verfiyManagerPhone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    verfiyTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'BSLoanOrder'
  });
};
