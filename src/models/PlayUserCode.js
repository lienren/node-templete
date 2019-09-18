/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PlayUserCode', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    phone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    isuse: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    createTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    reqTxt: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    rspTxt: {
      type: DataTypes.STRING(2000),
      allowNull: true
    }
  }, {
    tableName: 'PlayUserCode'
  });
};
