/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sms_flash_promotion_session', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'sms_flash_promotion_session'
  });
};
