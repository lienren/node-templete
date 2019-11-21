/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('integral_record', {
    ir_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    u_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    lower_u_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    ir_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    ir_integral: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    ir_remark: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    ir_state: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    ir_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'integral_record'
  });
};
