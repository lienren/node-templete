/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sms_home_advertise', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    pic: {
      type: DataTypes.STRING(500),
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
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    click_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    order_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    note: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    sort: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'sms_home_advertise'
  });
};
