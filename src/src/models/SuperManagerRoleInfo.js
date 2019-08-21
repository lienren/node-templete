/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SuperManagerRoleInfo', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    managerId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    roleId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    addTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'SuperManagerRoleInfo'
  });
};
