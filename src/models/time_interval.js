/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('time_interval', {
    ti_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ti_pid: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    ti_year: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    ti_day: {
      type: DataTypes.CHAR(5),
      allowNull: true
    },
    ti_week: {
      type: DataTypes.CHAR(2),
      allowNull: true
    },
    ti_show_time: {
      type: DataTypes.CHAR(13),
      allowNull: true
    },
    ti_type: {
      type: DataTypes.CHAR(2),
      allowNull: true
    },
    ti_already: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ti_quota: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ti_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'time_interval'
  });
};
