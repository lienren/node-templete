/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mk_company', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    cpName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    opName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    statusName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cpType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    cpTypeName: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    addTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    modifyTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'mk_company'
  });
};
