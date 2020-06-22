/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('manual_actual_controller_type', {
    id: {
      type: DataTypes.INTEGER(20).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ts_code: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    controller_type_2012: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    controller_type_2013: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    controller_type_2014: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    controller_type_2015: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    controller_type_2016: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    controller_type_2017: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    controller_type_2018: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    controller_type_2019: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    controller_type_2020: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    updatetime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ctime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'manual_actual_controller_type'
  });
};
