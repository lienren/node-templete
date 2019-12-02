/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('account', {
    a_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    c_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    a_username: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    a_password: {
      type: DataTypes.CHAR(32),
      allowNull: false
    },
    a_salt: {
      type: DataTypes.CHAR(8),
      allowNull: false
    },
    a_state: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    a_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'account'
  });
};
