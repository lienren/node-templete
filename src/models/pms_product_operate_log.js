/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pms_product_operate_log', {
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
    price_old: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    price_new: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    sale_price_old: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    sale_price_new: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    gift_point_old: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    gift_point_new: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    use_point_limit_old: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    use_point_limit_new: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    operate_man: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'pms_product_operate_log'
  });
};
