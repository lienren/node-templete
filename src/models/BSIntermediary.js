/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BSIntermediary', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    iName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    iContact: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    iContactPhone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    isVerfiy: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    addTime: {
      type: DataTypes.BIGINT,
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
    tableName: 'BSIntermediary'
  });
};
