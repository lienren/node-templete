/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('admin', {
    a_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    a_account: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    a_password: {
      type: DataTypes.CHAR(32),
      allowNull: false
    },
    a_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'admin'
  });
};
