/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ProofUser', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userPhone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userRealName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userIdCard: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userPwd: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userSalt: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    payPwd: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    paySalt: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    token: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tokenOverTime: {
      type: DataTypes.BIGINT,
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
    addTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    updateTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'ProofUser'
  });
};
