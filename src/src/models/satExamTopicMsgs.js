/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('satExamTopicMsgs', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    msgContext: {
      type: DataTypes.STRING(2000),
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
    tableName: 'satExamTopicMsgs'
  });
};
