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
    }
  }, {
    tableName: 'info_project_update'
  });
};
