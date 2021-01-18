/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ums_member_level', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    growth_point: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    default_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    free_freight_point: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    comment_growth_point: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    priviledge_free_freight: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    priviledge_sign_in: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    priviledge_comment: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    priviledge_promotion: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    priviledge_member_price: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    priviledge_birthday: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    note: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    tableName: 'ums_member_level'
  });
};
