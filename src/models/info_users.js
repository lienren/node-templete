/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    info_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    cx_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    batch_no: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    batchName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    cert_type: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    cert_no: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    birthday: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    age: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sex: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tel: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    nation: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    contact_name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    contact_relation: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    ga_area: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ga_organ: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ga_town: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ga_address: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    addr_area: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    abp0114: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    abp0113: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    aap0113: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    is_assessment: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    assessment_organ: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cbp0101: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    is_gpps: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    aap0114: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    abp0110: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    aap0112: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    bae0104: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    bae0102: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    bbp0103: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    bbp0102: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cbp0107: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cbp0108: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cbp0113: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cag0105: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    cag0104: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cbp0103: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    creator_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    flag: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    result: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    addr_organ: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    gdid: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    IS_KCDJ: {
      type: DataTypes.INTEGER(11),
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
    cusId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    cusName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    opStatus: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    opStatusName: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    connectType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    qa1: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    qa2: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    qa3: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    qa4: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    qa5: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    qa6: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    qa7: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    qa8: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    qa9: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    qa10: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    qa11: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    qa12: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    qa13: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cusTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cusConnectNum: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    areaName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    streetName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    summary: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'info_users'
  });
};
