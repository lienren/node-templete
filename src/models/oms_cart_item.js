/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('oms_cart_item', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    product_sku_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    member_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    product_pic: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    product_name: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    product_sub_title: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    product_sku_code: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    member_nickname: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    modify_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    delete_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    product_category_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    product_brand: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    product_sn: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    product_attr: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    tableName: 'oms_cart_item'
  });
};
