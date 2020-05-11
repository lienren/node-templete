/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('yh_msg', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    msgTitle: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    msgContent: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    addTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'yh_msg'
  });
};
