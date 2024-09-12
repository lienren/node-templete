/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cms_prefrence_area', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sub_title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pic: {
      type: "VARBINARY(500)",
      allowNull: true
    },
    sort: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    show_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, {
    tableName: 'cms_prefrence_area'
  });
};
