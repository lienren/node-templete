/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pms_product_attribute', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    product_attribute_category_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    select_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    input_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    input_list: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sort: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    filter_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    search_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    related_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    hand_add_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    is_del: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'pms_product_attribute'
  });
};
