/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cmp_recharge', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    cmp_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    cmp_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    discount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    cmp_admin_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    cmp_admin_name: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    arrive_state: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    arrive_state_name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    arrive_state_img1: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    arrive_state_img2: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    arrive_price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    verify_state: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    verify_state_name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    create_admin_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    create_admin_name: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'cmp_recharge'
  });
};
