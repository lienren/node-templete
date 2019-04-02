/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ProofLoan', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    loanSn: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    loanUserId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    loanUserRealName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    loanUserIdCard: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    masterUserId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    masterUserRealName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    masterUserIdCard: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    loanMoney: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    loanTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    repayTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    rate: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    loanUse: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    loanUseName: {
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
    serviceMoney: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    isPay: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    payTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    loanUserSign: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    masterUserSign: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    loanPdf: {
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
    confirmUserId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    confirmRealName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    loanType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    loanTypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    loanUserPhone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    masterUserPhone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    confirmUserPhone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    payMentType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    payMentTypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'ProofLoan'
  });
};
