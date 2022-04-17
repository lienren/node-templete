/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('svg_search', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    search_value: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    manage_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'svg_search'
  });
};
