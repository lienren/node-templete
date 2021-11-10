/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_user_samps', {
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
    startTime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    endTime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    dayCount: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    realCount: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    postName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    periodType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    handleType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    handleTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    handleCount: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sampName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    sampUserName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    imgUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    imgTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    isSend: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    sendTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sendRep: {
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
    tableName: 'info_user_samps'
  });
};
