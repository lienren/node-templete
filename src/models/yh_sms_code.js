/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('yh_sms_code', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    phone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    isUse: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    overTime: {
      type: DataTypes.DATE,
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
    tableName: 'yh_sms_code'
  });
};
