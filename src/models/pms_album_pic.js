/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pms_album_pic', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    album_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    pic: {
      type: DataTypes.STRING(1000),
      allowNull: true
    }
  }, {
    tableName: 'pms_album_pic'
  });
};
