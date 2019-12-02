/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orders', {
    o_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    o_code: {
      type: DataTypes.CHAR(22),
      allowNull: false
    },
    c_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    o_cus_code: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    o_send_person: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    o_send_tel: {
      type: DataTypes.CHAR(11),
      allowNull: false
    },
    o_send_province: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    o_send_city: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    o_send_district: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    o_send_street: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    o_send_address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    w_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    o_temporary_state: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    o_state: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    o_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    o_switch: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    o_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    o_send_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    o_sign_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    o_csc_code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    o_courier: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    o_remarks: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    o_weight: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    o_number: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    o_transport_cost: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    o_estimate_min: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    o_estimate_max: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'orders'
  });
};
