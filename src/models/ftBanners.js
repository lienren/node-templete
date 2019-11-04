/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ftBanners', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    imgUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    imgLink: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    sortIndex: {
      type: DataTypes.INTEGER(11),
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
    },
    imgType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    imgTypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'ftBanners'
  });
};
