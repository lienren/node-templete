/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('news_sina_zhibo', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    sid: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    rich_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_need_check: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    check_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    check_status: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    is_delete: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    top_value: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    is_focus: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tag: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    updatetime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ctime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'news_sina_zhibo'
  });
};
