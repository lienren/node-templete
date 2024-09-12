/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cms_user_currency_log', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    cmp_admin_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    cmp_admin_name: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    cmp_member_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    cmp_member_name: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    state_context: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    state_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    op_admin_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    op_admin_name: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'cms_user_currency_log'
  });
};
