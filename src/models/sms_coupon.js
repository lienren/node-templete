/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sms_coupon', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    platform: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    per_limit: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    min_point: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    use_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    note: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    publish_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    use_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    receive_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    enable_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    code: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    member_level: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, {
    tableName: 'sms_coupon'
  });
};
