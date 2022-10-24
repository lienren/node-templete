/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_user_cert', {
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
    certName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    certNum: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    certDesc: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    certTime: {
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
    tableName: 'info_user_cert'
  });
};
