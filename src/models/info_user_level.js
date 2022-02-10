/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_user_level', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    year: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    levelType: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    checkUser: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    checkTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'info_user_level'
  });
};
