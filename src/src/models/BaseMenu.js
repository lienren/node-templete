/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BaseMenu', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    menuName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    menuLink: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    menuIcon: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    level: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    parentId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sort: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    addTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    parentName: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'BaseMenu'
  });
};
