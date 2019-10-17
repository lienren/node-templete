/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ftAccount', {
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    totalBrokerage: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    totalOverPrice: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    curOverPrice: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    preOccupy: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    handFeeRate: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    taxRate: {
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
    tableName: 'ftAccount'
  });
};
