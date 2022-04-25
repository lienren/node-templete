/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_house_yearrent', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    hid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    hhid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    a1: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    a2: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    a3: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    a4: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    a5: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    modifyTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'info_house_yearrent'
  });
};
