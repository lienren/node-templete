/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('exp_info', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    customId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sendStartTime: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    jContact: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    jMobile: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    jProvince: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    jCity: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    jRegion: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    jAddress: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    dContact: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    dMobile: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    dProvince: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    dCity: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    dRegion: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    dAddress: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    custid: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    payMethod: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    expressType: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    packagesNo: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    depositumInfo: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    depositumNo: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    companyId: {
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
    mailno: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    extData: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'exp_info'
  });
};
