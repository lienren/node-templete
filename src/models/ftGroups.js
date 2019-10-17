/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ftGroups', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    gIndex: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    gName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    groupUserId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    groupUserName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    groupUserPhone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    gSiteName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    gSiteAddress: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    gSitePickAddress: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    gSitePosition: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    gStartTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    gEndTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    gStatus: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    gStatusName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    gProductNum: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    gOrderNum: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    gType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    gTypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    addTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updateTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'ftGroups'
  });
};
