/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rotation_chart', {
    rc_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    rc_title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    rc_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    rc_path: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rc_is_show: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    rc_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'rotation_chart'
  });
};
