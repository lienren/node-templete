/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ums_member', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    member_level_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    nickname: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    gender: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    job: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    personalized_signature: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    source_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    integration: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    growth: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    luckey_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    history_integration: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    user_company_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    is_del: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    cmp_admin_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    cmp_admin_name: {
      type: DataTypes.STRING(64),
      allowNull: true
    }
  }, {
    tableName: 'ums_member'
  });
};
