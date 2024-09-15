/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_users_bak', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    street: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    community: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    sex: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    nation: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    political: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    edu1: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    school: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    major: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    hold: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    holdTime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    workTime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    post: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    postLevel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    idcard: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    specialty: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    isretire: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    isresign: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    toretire: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    edu2: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updateTime: {
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
    tableName: 'info_users_bak'
  });
};
