/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('litemall_storage', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    key: {
      type: DataTypes.STRING(63),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    size: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(255),
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
    tableName: 'litemall_storage'
  });
};
