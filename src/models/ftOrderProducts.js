/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ftOrderProducts', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    oId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    oSN: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    proId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    proTitle: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    proMasterImg: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    specInfo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    proType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    proTypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pickTime: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    originalPrice: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    sellPrice: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    costPrice: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    proProfit: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    pNum: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    totalPrice: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    totalProfit: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    isLimit: {
      type: DataTypes.INTEGER(11),
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
    addTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    rebateType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    rebateTypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    rebateRate: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    rebatePrice: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    totalRebatePrice: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    gProType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    gProTypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    roundId: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'ftOrderProducts'
  });
};
