/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tmp_info_lbyusers', {
    idcard: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'tmp_info_lbyusers'
  });
};
