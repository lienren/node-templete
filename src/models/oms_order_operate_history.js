/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('oms_order_operate_history', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    operate_man: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    order_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    note: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    tableName: 'oms_order_operate_history'
  });
};
