/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ums_member_rule_setting', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    continue_sign_day: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    continue_sign_point: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    consume_per_point: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    low_order_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    max_point_per_order: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, {
    tableName: 'ums_member_rule_setting'
  });
};
