/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ftProducts', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    proType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    proTypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    proIndex: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sortId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sortName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    subTitle: {
      type: DataTypes.STRING(100),
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
    isLimit: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    limitNum: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    pickTime: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    specInfo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    isOnline: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    proVerifyType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    proVerifyTypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    proVerifyTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    stock: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    saleNum: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    saleNumV: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    masterImg: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    subImg: {
      type: DataTypes.TEXT,
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
    groupUserId: {
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
    isRecommend: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'ftProducts'
  });
};
