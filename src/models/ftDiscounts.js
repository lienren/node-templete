/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ftDiscounts', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    disTitle: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    disSubTitle: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    disImg: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    disSendType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    disSendTypeName: {
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
    disValType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    disValTypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    disVal: {
      type: DataTypes.STRING(100),
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
    disRangeType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    disRangeTypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    disRange: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'ftDiscounts'
  });
};
