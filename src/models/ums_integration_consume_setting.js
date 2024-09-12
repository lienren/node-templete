/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ums_integration_consume_setting', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    deduction_per_amount: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    max_percent_per_order: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    use_unit: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    coupon_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, {
    tableName: 'ums_integration_consume_setting'
  });
};
