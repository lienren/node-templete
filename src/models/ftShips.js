/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ftShips', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    day: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    shipSN: {
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
    shipStatus: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    shipStatusName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    shipTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    signTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    orderNum: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    productNum: {
      type: DataTypes.INTEGER(11),
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
    },
    groupId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    groupName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    groupSiteName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    groupSitePosition: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    groupSiteAddress: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    groupSitePickAddress: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cName: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'ftShips'
  });
};
