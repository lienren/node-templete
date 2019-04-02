/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BSDoctorDep', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    dorId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    depId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    addTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'BSDoctorDep'
  });
};
