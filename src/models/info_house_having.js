/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_house_having', {
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
    a1: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    a2: {
      type: DataTypes.STRING(100),
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
    a6: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    a7: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    a8: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    a9: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    a10: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    a11: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    a12: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: '否'
    },
    a13: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    a14: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '1'
    },
    a15: {
      type: DataTypes.STRING(100),
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
    tableName: 'info_house_having'
  });
};
