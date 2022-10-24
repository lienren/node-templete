/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_msg', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    avatar: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    msg: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    time: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    barrageStyle: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    isSend: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'info_msg'
  });
};
