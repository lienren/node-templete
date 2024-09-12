/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cms_subject_product_relation', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    subject_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'cms_subject_product_relation'
  });
};
