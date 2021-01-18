/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('oms_company_address', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    address_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    send_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    receive_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    province: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    region: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    detail_address: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    tableName: 'oms_company_address'
  });
};
