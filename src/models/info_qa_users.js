/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_qa_users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    qid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    openid: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    uname: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    uphone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ucode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    uimg: {
      type: DataTypes.STRING(1000),
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
    tableName: 'info_qa_users'
  });
};
