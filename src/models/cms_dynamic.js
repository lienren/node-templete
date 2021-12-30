/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cms_dynamic', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    masterImg: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    addr: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    isAll: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    viewCount: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updateTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    publisherId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    publisherName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    reviewerId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    reviewerName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    reviewerTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    reviewerStatus: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    reviewerStatusName: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    tableName: 'cms_dynamic'
  });
};