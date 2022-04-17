/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('website_news', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    img_url: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    context: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '1'
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
    tableName: 'website_news'
  });
};
