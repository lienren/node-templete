/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mk_company_data', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    cpId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    cpName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    dataIndex: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    dataText: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    dataValue: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    dataSource: {
      type: DataTypes.STRING(1000),
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
    tableName: 'mk_company_data'
  });
};
