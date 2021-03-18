/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('gps_map_assess', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    gps_map_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    admin_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    admin_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    assess_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    assess_context: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    assess_sum: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'gps_map_assess'
  });
};
