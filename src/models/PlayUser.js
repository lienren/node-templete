/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PlayUser', {
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
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userName: {
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
    tableName: 'PlayUser'
  });
};
