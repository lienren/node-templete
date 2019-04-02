/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BSLoanOrderState', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    orderSn: {
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
    extPrice: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    extReturnTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    addTime: {
      type: DataTypes.BIGINT,
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
    }
  }, {
    tableName: 'BSLoanOrderState'
  });
};
