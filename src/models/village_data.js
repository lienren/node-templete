/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('village_data', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    villageId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    villageName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    dataType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    headImg: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    d1: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    d2: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    d3: {
      type: DataTypes.STRING(300),
      allowNull: true
    }
  }, {
    tableName: 'village_data'
  });
};
