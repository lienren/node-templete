/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('warehouse', {
    w_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    c_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    csc_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    cs_c_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    cs_csc_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    w_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    w_data_flag: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    w_receive_person: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    w_receive_tel: {
      type: DataTypes.CHAR(11),
      allowNull: false
    },
    w_receive_province: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    w_receive_city: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    w_receive_district: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    w_receive_street: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    w_receive_address: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    w_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'warehouse'
  });
};
