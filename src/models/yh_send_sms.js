/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('yh_send_sms', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    smsTitle: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    smsContent: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    smsPhones: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    addTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sendCount: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sendStatus: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sendStatusName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    sendTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    receiveVal: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    receiveTime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'yh_send_sms'
  });
};
