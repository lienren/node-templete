/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('employee_composition_info', {
    ts_code: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    info: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'employee_composition_info'
  });
};
