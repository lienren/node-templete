/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('grade', {
    g_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    u_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    lower_u_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    g_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'grade'
  });
};
