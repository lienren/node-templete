/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ftCity', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    cName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cShortCode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    cPinyin: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    pName: {
      type: DataTypes.STRING(100),
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
    tableName: 'ftCity'
  });
};
