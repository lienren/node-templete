/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('yh_banners', {
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
    imgText: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    linkUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    linkParams: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    imgState: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    addTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'yh_banners'
  });
};
