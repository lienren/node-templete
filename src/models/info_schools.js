/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_schools', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    schoolCode: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    schoolName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    modelAddress: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    modelConcat: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    modelConcatPhone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'info_schools'
  });
};
