/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ums_admin', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    salt: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    nick_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    note: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    login_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '1'
    },
    token: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    token_over_time: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    last_time: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    is_del: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    user_type: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '1'
    },
    user_type_name: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: '管理员'
    },
    user_parentid: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    user_company_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    user_company_branch_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_dept_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    provider_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    provider_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'ums_admin'
  });
};
