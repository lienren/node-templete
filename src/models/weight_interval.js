/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('weight_interval', {
    wi_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    wi_title: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    wi_min: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    wi_max: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    wi_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'weight_interval'
  });
};
