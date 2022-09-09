/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_sendmsg', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    sid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    periodType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    sendPhone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    sendTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sendContent: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    repContent: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    repTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'info_sendmsg'
  });
};
