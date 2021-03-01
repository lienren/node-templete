/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pms_product_category', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    parent_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    level: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    product_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    product_unit: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    nav_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    show_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    sort: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    keywords: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'pms_product_category'
  });
};