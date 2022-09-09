/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_posts', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    postName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tradeType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cycleType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    periodType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sampWay: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    lbyId: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    tableName: 'info_posts'
  });
};
