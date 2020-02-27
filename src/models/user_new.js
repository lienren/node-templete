/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_new', {
    u_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    sign_time: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    n_integral: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    n_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'user_new'
  });
};
