/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hs300history', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    weight: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    display_name: {
      type: DataTypes.STRING(11),
      allowNull: false
    },
    date: {
      type: DataTypes.STRING(11),
      allowNull: false
    },
    new_code: {
      type: DataTypes.STRING(40),
      allowNull: false
    }
  }, {
    tableName: 'hs300history'
  });
};
