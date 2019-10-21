/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ftGroupProducts', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    gId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    gProType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    gProTypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    proId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    teamNum: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    isRecommend: {
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
    }
  }, {
    tableName: 'ftGroupProducts'
  });
};
