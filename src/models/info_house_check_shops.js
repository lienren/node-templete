/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_house_check_shops', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    cid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    a1: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    shopName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cUsers: {
      type: DataTypes.TEXT,
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
    tableName: 'info_house_check_shops'
  });
};
