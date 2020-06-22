/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('em_notice', {
    id: {
      type: DataTypes.INTEGER(20).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    COLUMNCODE: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    COLUMNNAME: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ENDDATE: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    EUTIME: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    INFOCODE: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    NOTICEDATE: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    NOTICETITLE: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    TABLEID: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    COMPANYCODE: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    SECURITYCODE: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    SECURITYFULLNAME: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    SECURITYSHORTNAME: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    SECURITYTYPE: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    SECURITYTYPECODE: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    SECURITYVARIETYCODE: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    TRADEMARKET: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    TRADEMARKETCODE: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    updatetime: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ctime: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'em_notice'
  });
};
