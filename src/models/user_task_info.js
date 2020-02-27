/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_task_info', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    uId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    taskName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    taskContext: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    taskIntegral: {
      type: DataTypes.INTEGER(255),
      allowNull: true,
      defaultValue: '0'
    },
    uNickName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    uHeadImg: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    uPosition: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    addTime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'user_task_info'
  });
};
