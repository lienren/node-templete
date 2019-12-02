/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customer', {
    c_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    c_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    c_tel: {
      type: DataTypes.CHAR(11),
      allowNull: false
    },
    c_money: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    c_identity: {
      type: DataTypes.CHAR(8),
      allowNull: false
    },
    c_push_path: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    c_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'customer'
  });
};
