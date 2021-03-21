/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('applyLogs', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    applyId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    adminId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    adminName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    statusName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'applyLogs'
  });
};
