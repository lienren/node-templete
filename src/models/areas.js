/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('areas', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    level: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    ad_code: {
      type: DataTypes.CHAR(6),
      allowNull: false
    },
    city_code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    center: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    p_code: {
      type: DataTypes.CHAR(6),
      allowNull: false
    }
  }, {
    tableName: 'areas'
  });
};
