/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pms_product', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    brand_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    product_category_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    feight_template_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    product_attribute_category_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    pic: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    product_sn: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    delete_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    publish_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    new_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    recommand_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    verify_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    sort: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sale: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    promotion_price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    gift_growth: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    gift_point: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    use_point_limit: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sub_title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    original_price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    stock: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    low_stock: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    unit: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    weight: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    preview_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    service_ids: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    keywords: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    album_pics: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    detail_title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    detail_desc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    detail_html: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    detail_mobile_html: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    promotion_start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    promotion_end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    promotion_per_limit: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    promotion_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    brand_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    product_category_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'pms_product'
  });
};
