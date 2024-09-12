/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ums_admin_role_relation', {
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
    role_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'ums_admin_role_relation'
  });
};
