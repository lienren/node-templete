/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pms_album', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    cover_pic: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    pic_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sort: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: true
    }
  }, {
    tableName: 'pms_album'
  });
};
