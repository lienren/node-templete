/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_house', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    sn: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    a1: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    a2: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    a3: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    a4: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    a5: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    a6: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    a7: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    a8: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    a9: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    a10: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    a11: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    a12: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    a13: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    a14: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    a15: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    a16: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    a17: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    street: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    community: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(500),
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
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'info_house'
  });
};
