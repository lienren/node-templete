/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cmp_recharge_log', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    cmp_recharge_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    state_context: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    state_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    op_admin_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    op_admin_name: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'cmp_recharge_log'
  });
};
