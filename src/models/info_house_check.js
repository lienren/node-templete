/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_house_check', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    hid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    a1: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    cType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cUsers: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    cUserIds: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    cContent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cStatus: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'info_house_check'
  });
};
