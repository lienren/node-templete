/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_notifys', {
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
    modelId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    manageId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    notifyType: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    notifyContent: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    sendPhone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    isSend: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sendTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sendResult: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'info_notifys'
  });
};
