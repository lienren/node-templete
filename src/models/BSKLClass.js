/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BSKLClass', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    className: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sort: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    isdel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    addTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'BSKLClass'
  });
};
