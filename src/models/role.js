/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('role', {
    r_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    r_type: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    r_name: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    r_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'role'
  });
};
