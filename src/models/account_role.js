/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('account_role', {
    ar_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    a_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'account',
        key: 'a_id'
      }
    },
    r_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    ar_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'account_role'
  });
};
