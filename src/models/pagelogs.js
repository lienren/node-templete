/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pagelogs', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    terminalId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    openId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    udcId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    fromUdcId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    prePageUrl: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    prePageName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    prePageSort: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    pageName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pageUrl: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pageSort: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    eventName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    activeName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    eventValue: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    sourceId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    projectCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    projectName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    trafficSource: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    mediumId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    classId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    channelId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    businessCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    applyNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    startTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    useTime: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    screenSize: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    screenDPI: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    userAgent: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    addTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    addTimeYMD: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    ip: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'pagelogs'
  });
};
