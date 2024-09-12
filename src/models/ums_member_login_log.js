/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ums_member_login_log', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    member_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    login_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    province: {
      type: DataTypes.STRING(64),
      allowNull: true
    }
  }, {
    tableName: 'ums_member_login_log'
  });
};
