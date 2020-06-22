/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('litemall_log', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    admin: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    type: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    action: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    result: {
      type: DataTypes.STRING(127),
      allowNull: true
    },
    comment: {
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
    tableName: 'litemall_log'
  });
};
