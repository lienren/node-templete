/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('accurate_order_children', {
    aoc_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ao_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    dc_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    aoc_number: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    aoc_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'accurate_order_children'
  });
};
