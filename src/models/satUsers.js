/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('satUsers', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    openId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    unionId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userHeadImg: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    userName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userPhone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userInfo: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    addTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'satUsers'
  });
};
