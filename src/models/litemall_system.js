/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('litemall_system', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    key_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    key_value: {
      type: DataTypes.STRING(255),
      allowNull: false
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
    tableName: 'litemall_system'
  });
};
