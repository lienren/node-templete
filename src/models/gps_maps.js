/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('gps_maps', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    a1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    a2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    a3: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    a4: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    a5: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    a6: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    a7: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    latitude: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    longitude: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'gps_maps'
  });
};
