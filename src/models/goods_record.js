/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('goods_record', {
    gr_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    g_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    gr_sn: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    u_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    gr_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    gr_mobile: {
      type: DataTypes.CHAR(11),
      allowNull: false
    },
    gr_address: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    gr_number: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    gr_waybill_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    gr_waybill_no: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    gr_state: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    gr_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    gr_pca: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    g_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    g_photo: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    g_spec: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    gr_remark: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    g_integral: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    gr_integral: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'goods_record'
  });
};
