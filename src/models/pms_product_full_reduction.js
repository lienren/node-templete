/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pms_product_full_reduction', {
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
    full_price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    reduce_price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  }, {
    tableName: 'pms_product_full_reduction'
  });
};
