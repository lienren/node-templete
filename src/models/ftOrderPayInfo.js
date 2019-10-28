/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ftOrderPayInfo', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    oSn: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    payContent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    addTime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'ftOrderPayInfo'
  });
};
