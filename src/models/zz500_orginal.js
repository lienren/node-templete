/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('zz500_orginal', {
    code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    weight: {
      type: "DOUBLE",
      allowNull: true
    },
    display_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'zz500_orginal'
  });
};
