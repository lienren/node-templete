/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('applyBlackInfo', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    kw: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    kwType: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updateTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'applyBlackInfo'
  });
};
