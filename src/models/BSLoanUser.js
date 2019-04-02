/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BSLoanUser', {
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
    userSex: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userIdCard: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    addTime: {
      type: DataTypes.BIGINT,
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
    },
    addManagerId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    addManager: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    addManagerPhone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'BSLoanUser'
  });
};
