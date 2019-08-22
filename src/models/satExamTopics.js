/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('satExamTopics', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    examId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    topicTypeId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    topicTypeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tIndex: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tAnswer: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tTestCenter: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tAnalysis: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    tFollowNum: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tMsgNum: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    addTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'satExamTopics'
  });
};
