/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('accurate_order', {
    ao_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ao_number: {
      type: DataTypes.CHAR(13),
      allowNull: false
    },
    ao_waybill_no: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    u_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    ao_person: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    ao_mobile: {
      type: DataTypes.CHAR(11),
      allowNull: false
    },
    ao_address: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    d_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    ao_remark: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    ao_photo: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    ao_status: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    ao_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'accurate_order'
  });
};
