/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('news_bulletin_flow', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    basic_id: {
      type: DataTypes.INTEGER(255),
      allowNull: false
    },
    source: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    link: {
      type: DataTypes.STRING(255),
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
    tableName: 'news_bulletin_flow'
  });
};
