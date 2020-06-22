/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('jq_stocks', {
    index: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    display_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'jq_stocks'
  });
};
