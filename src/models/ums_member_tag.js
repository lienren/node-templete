/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ums_member_tag', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    finish_order_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    finish_order_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  }, {
    tableName: 'ums_member_tag'
  });
};
