/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('baLogs', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    baId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    baName: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    applyId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'baLogs'
  });
};
