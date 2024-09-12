/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sms_home_new_product', {
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
    product_name: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    recommend_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    sort: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, {
    tableName: 'sms_home_new_product'
  });
};
