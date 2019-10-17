/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ftOrders', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    oSN: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    oType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    oTypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    parentOSN: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    oDisPrice: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    oDisId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    oDisName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    oStatus: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    oStatusName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    oStatusTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isPay: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    payTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    oShipStatus: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    oShipStatusName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    oShipTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    groupId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    groupName: {
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
    groupUserPhone: {
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
    isSettlement: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    settlementTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    settlementPrice: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  }, {
    tableName: 'ftOrders'
  });
};
