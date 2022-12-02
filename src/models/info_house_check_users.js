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
    sid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    cUsers: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cUserImg: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cRemark: {
      type: DataTypes.TEXT,
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
    cUnUserName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cUnUserImg: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cContent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cTime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    cResult: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isProblem: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    cProblem: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    cProblemImgs: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cMeasure: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    isRepeat: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    tableName: 'info_house_check_users'
  });
};
