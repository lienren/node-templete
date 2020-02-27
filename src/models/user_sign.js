/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_sign', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    u_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    sign_time: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    s_integral: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    s_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'user_sign'
  });
};
