/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_user_job', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    oStreet: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    oCommunity: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    nStreet: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nCommunity: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    hanlder: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    hanldeTime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'info_user_job'
  });
};
