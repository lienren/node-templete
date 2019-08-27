/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('satStatistics', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    day: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    s1: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    s2: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    s3: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    s4: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    s5: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    s6: {
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
    }
  }, {
    tableName: 'satStatistics'
  });
};
