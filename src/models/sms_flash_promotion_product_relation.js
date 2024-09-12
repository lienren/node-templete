/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sms_flash_promotion_product_relation', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    flash_promotion_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    flash_promotion_session_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    flash_promotion_price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    flash_promotion_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    flash_promotion_limit: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sort: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'sms_flash_promotion_product_relation'
  });
};
