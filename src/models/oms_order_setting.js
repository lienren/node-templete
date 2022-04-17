/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('oms_order_setting', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    flash_order_overtime: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    normal_order_overtime: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    confirm_overtime: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    finish_overtime: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    comment_overtime: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'oms_order_setting'
  });
};
