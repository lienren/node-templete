/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('baInfo', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    openId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    baName: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    baPhone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'baInfo'
  });
};
