/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sms_coupon_product_relation', {
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
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    product_name: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    product_sn: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    tableName: 'sms_coupon_product_relation'
  });
};
