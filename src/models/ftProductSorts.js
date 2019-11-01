/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ftProductSorts', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    sortName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sortIndex: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    groupUserId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sortType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sortTypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sortImg: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    addTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updateTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'ftProductSorts'
  });
};
