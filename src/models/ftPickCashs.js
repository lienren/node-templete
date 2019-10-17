/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ftPickCashs', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    pickCashType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    pickCashTypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pickPrice: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    handFeePrice: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    pickCashContext: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    pickCashStatus: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    pickCashStatusName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pickCashStatusTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    addTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'ftPickCashs'
  });
};
