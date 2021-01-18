/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ums_member_member_tag_relation', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    member_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    tag_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'ums_member_member_tag_relation'
  });
};
