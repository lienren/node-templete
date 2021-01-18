/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('oms_order_return_apply', {
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
    company_address_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    order_sn: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    member_username: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    return_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    return_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    return_phone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    handle_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    product_pic: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    product_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    product_brand: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    product_attr: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    product_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    product_price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    product_real_price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    reason: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    proof_pics: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    handle_note: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    handle_man: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    receive_man: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    receive_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    receive_note: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    tableName: 'oms_order_return_apply'
  });
};
