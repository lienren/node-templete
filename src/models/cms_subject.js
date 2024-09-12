/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cms_subject', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pic: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    product_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    recommend_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    collect_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    read_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    comment_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    album_pics: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    show_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    forward_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    category_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    tableName: 'cms_subject'
  });
};
