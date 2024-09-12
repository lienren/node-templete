/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ums_member_receive_address', {
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone_number: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    default_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    post_code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    province: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    region: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    detail_address: {
      type: DataTypes.STRING(128),
      allowNull: true
    }
  }, {
    tableName: 'ums_member_receive_address'
  });
};
