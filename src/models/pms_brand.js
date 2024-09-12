/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pms_brand', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    first_letter: {
      type: DataTypes.STRING(8),
      allowNull: true
    },
    sort: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    factory_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    show_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    product_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    product_comment_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    big_pic: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    brand_story: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_del: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'pms_brand'
  });
};
