/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sms_flash_promotion_log', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    member_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    member_phone: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    product_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    subscribe_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    send_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'sms_flash_promotion_log'
  });
};
