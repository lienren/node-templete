/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('courier_services_company', {
    csc_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    csc_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    csc_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    csc_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'courier_services_company'
  });
};
