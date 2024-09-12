/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ums_resource', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    url: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    is_del: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'ums_resource'
  });
};
