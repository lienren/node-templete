/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('litemall_admin', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(63),
      allowNull: false,
      defaultValue: ''
    },
    password: {
      type: DataTypes.STRING(63),
      allowNull: false,
      defaultValue: ''
    },
    last_login_ip: {
      type: DataTypes.STRING(63),
      allowNull: true,
      defaultValue: ''
    },
    last_login_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '\''
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
    },
    role_ids: {
      type: DataTypes.STRING(127),
      allowNull: true,
      defaultValue: '[]'
    },
    phone: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    area: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'litemall_admin'
  });
};
