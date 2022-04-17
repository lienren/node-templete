/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('svg_maps', {
    id: {
      type: DataTypes.INTEGER(255),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    dir: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    svg: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    xml: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    is_del: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'svg_maps'
  });
};
