/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_house_check_users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    cid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    isUn: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    cIsHandle: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    cUserId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    cUserName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cUserImg: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    cRemark: {
      type: DataTypes.STRING(500),
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
    }
  }, {
    tableName: 'info_house_check_users'
  });
};
