/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PlayAttrValue', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    attrId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    attrName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    attrType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    attrValue: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    attrSort: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    createTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'PlayAttrValue'
  });
};
