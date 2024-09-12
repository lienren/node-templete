/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pms_sku_stock', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    sku_code: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    stock: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    low_stock: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    pic: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sale: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    promotion_price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    lock_stock: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    sp_data: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    tableName: 'pms_sku_stock'
  });
};
