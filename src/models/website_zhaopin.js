/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('website_zhaopin', {
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
    work_area: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    job: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    skill: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    other: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    num: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    is_del: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'website_zhaopin'
  });
};
