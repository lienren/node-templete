/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sms_coupon_product_category_relation', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    coupon_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    product_category_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    product_category_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    parent_category_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    tableName: 'sms_coupon_product_category_relation'
  });
};
