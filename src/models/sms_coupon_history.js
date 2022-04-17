/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sms_coupon_history', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    coupon_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    member_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    coupon_code: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    member_nickname: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    get_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    use_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    use_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    order_sn: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'sms_coupon_history'
  });
};
