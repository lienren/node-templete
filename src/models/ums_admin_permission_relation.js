/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ums_admin_permission_relation', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    admin_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    permission_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, {
    tableName: 'ums_admin_permission_relation'
  });
};
