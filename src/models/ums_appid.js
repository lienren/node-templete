/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ums_appid', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    appid: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    appsecret: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    user_company_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    user_company_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'ums_appid'
  });
};
