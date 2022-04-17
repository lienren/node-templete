/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pms_product_category_attribute_relation', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    product_category_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    product_attribute_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'pms_product_category_attribute_relation'
  });
};
