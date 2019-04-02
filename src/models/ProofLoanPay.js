/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ProofLoanPay', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    loanId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    outOrderSn: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    loanSn: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    merId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    notifyUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    nonceStr: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    orderMoney: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    orderTime: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sign: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    payType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    payTypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    payTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    reqparam: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    repparam: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    payName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    addTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    updateTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'ProofLoanPay'
  });
};
