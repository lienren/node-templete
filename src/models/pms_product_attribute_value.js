/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pms_product_attribute_value', {
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
    product_attribute_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    value: {
      type: DataTypes.STRING(64),
      allowNull: true
    }
  }, {
    tableName: 'pms_product_attribute_value'
  });
};
