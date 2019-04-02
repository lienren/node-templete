/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('WebSiteConfig', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    webConfigName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    webConfigContent: {
      type: DataTypes.STRING(8000),
      allowNull: true
    },
    lastUpdateTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'WebSiteConfig'
  });
};
