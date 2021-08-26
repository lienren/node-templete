/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('school_users_v2', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    openId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    x1: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    x2: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    x3: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    x4: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    x5: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    x6: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    x7: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    x8: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    x9: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    x10: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    x11: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    x12: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    x13: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    x14: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    x15: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    x16: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    x17: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    x18: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    x19: {
      type: DataTypes.DATE,
      allowNull: true
    },
    x20: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    x21: {
      type: DataTypes.STRING(3000),
      allowNull: true
    },
    xState: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    xStateName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    xBackTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    addTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    mOpenId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    mOpenName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    xIsAdd: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    xlsAddTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    area: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    x22: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    x23: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    x24: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    x25: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    x26: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    x27: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    x28: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    x29: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    x30: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    x31: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    x32: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    state: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    stateName: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    tableName: 'school_users_v2'
  });
};
