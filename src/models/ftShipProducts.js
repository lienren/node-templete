/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ftShipProducts', {
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
    proId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    proTitle: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    specInfo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    proNum: {
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
    totalSellPrice: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    totalCostPrice: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    totalProfit: {
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
    tableName: 'ftShipProducts'
  });
};
