/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cms_member_report', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    report_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    report_member_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    report_object: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    report_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    handle_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    note: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    tableName: 'cms_member_report'
  });
};
