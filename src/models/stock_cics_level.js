/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stock_cics_level', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    level_one_code: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    level_one_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    level_two_code: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    level_two_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    level_three_code: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    level_three_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    level_four_code: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    level_four_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    csi300: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    ctime: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'stock_cics_level'
  });
};
