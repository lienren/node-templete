/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('help', {
    h_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    h_service_tel: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    h_integral_introduce: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    h_make_introduce: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    h_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'help'
  });
};
