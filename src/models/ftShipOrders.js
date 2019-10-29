/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ftShipOrders', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    shipId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    orderId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    orderSn: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    groupUserId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    groupUserName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    proNum: {
      type: DataTypes.INTEGER(11),
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
    tableName: 'ftShipOrders'
  });
};
