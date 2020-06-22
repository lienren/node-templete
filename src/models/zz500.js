/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('zz500', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    date: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    symbol: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    weight: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    display_name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    ctime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatetime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'zz500'
  });
};
