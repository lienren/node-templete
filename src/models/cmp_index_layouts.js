/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cmp_index_layouts', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    cmp_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pro_ids: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    layout_type: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    layout_type_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sort: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    is_del: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'cmp_index_layouts'
  });
};
