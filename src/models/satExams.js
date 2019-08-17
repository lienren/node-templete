/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('satExams', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    examType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    examTypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    examTime: {
      type: DataTypes.DATE,
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
    tableName: 'satExams'
  });
};
