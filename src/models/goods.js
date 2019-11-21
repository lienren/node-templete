/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('goods', {
    g_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    g_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    g_integral: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    g_photo: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    g_introduce: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    g_is_show: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    g_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'goods'
  });
};
