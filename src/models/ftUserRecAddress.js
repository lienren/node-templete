/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ftUserRecAddress', {
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
    recName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    recPhone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    recSiteName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    recAddress: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    recPName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    recCName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    recAName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    isDefault: {
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
    tableName: 'ftUserRecAddress'
  });
};
