/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('oms_order_item', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    order_sn: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    product_pic: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    product_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    product_brand: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    product_sn: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    product_price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    product_quantity: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    product_sku_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    product_sku_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    product_category_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    promotion_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    promotion_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    coupon_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    integration_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    real_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    gift_integration: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    gift_growth: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    product_attr: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    is_comment: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    comment_star: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    comment_content: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    provider_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    provider_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    is_delivery: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    delivery_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    delivery_company: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    delivery_sn: {
      type: DataTypes.STRING(64),
      allowNull: true
    }
  }, {
    tableName: 'oms_order_item'
  });
};
