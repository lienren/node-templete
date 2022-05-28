/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stat_regular', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    regularDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    regularType: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    regularName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    regularSum: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    regularNum: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    regularNoNum: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    regularRate: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'stat_regular'
  });
};
