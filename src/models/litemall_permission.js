/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('litemall_permission', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    role_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    permission: {
      type: DataTypes.STRING(63),
      allowNull: true
    },
    add_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'litemall_permission'
  });
};
