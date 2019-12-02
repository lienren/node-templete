/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orders_temporary', {
    ot_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    o_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    ot_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'orders_temporary'
  });
};
