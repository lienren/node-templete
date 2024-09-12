/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pms_member_price', {
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
    member_level_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    member_price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    member_level_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'pms_member_price'
  });
};
