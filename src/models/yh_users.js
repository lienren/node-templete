/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('yh_users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userPhone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    userPwd: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    userSalt: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    defId: {
      type: DataTypes.INTEGER(100),
      allowNull: true
    },
    defName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userCompName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userStatus: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    userStatusName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    addTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(255),
      allowNull: true
    }
  }, {
    tableName: 'yh_users'
  });
};
