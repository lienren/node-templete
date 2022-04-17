/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cms_topic_comment', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    member_nick_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    topic_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    member_icon: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    content: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    show_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, {
    tableName: 'cms_topic_comment'
  });
};
