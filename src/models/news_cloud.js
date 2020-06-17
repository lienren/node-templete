/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('news_cloud', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    source: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    author: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    newstype: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    addtime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    pubtime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'news_cloud'
  });
};
