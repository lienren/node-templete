/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PlayOrders', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    osn: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    otype: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    otypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    opeopleNum: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    oprice: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    oselectTime: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    oselectDay: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    userPhone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    oprojectId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    oprojectName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    oprojectPageAge: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    oprojectBusUserId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    oprojectBusUserName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    oprojectBusUserInfo: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    ostate: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    ostateName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    createTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'PlayOrders'
  });
};
