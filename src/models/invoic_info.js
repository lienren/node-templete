/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('invoic_info', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    a1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    a2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    a3: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    a4: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    a5: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    a6: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    a7: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    a8: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    a9: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    a10: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'invoic_info'
  });
};
