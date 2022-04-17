/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SuperManagerOpLogs', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    manageId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    manageName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    opTitle: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    opContext: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    creatTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'SuperManagerOpLogs'
  });
};
