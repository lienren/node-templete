/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ums_role_permission_relation', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    role_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    permission_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'ums_role_permission_relation'
  });
};
