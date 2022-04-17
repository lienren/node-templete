/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SuperRoleMenuInfo', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    roleId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    menuId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    addTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'SuperRoleMenuInfo'
  });
};
