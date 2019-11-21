/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dict_data', {
    dd_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    dd_sort: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    dd_label: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    dd_value: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    dt_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    dd_list_class: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    dd_status: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    dd_remark: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    dd_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'dict_data'
  });
};
