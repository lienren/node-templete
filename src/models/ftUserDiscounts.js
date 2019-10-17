/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ftUserDiscounts', {
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
    disId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    disTitle: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    disSubTitle: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    disType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    disTypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    disContext: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    disStartTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    disEndTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isUse: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    isOver: {
      type: DataTypes.INTEGER(11),
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
    }
  }, {
    tableName: 'ftUserDiscounts'
  });
};
