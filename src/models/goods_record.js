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
    }
  }, {
    tableName: 'goods_record'
  });
};
