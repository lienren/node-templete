/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_user', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    customerId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    nickName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userPhone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    userIdCard: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    userSex: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    userAddress: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userSpeciality: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    userHeadImg: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    isPartyMember: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    partyMemberName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    streetId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    streetName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    communityId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    communityName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    villageId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    villageName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    isMute: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    muteTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    muteEndTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    customerJSON: {
      type: DataTypes.TEXT,
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
    userIntegral: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    isComplete: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    onJob: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: ''
    },
    workName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    postName: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'info_user'
  });
};