/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_models', {
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
    modelType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    modelNum: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    modelImg: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    modelStatus: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    bangTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    scrapRemark: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    scrapTime: {
      type: DataTypes.DATE,
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
    tableName: 'info_models'
  });
};
