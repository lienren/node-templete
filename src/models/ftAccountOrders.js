/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ftAccountOrders', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    day: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    orderId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    orderSN: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    orderType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    orderTypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    settlementPrice: {
      type: DataTypes.DECIMAL,
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
    tableName: 'ftAccountOrders'
  });
};
