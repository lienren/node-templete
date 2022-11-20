/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_project_update', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    sub_title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pro_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    pro_sub_verify: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    manage_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    manage_user: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    manage_remark: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    update_type: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    tableName: 'info_project_update'
  });
};
