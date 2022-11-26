/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_projects', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    pro_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    pro_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pro_level: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    pro_status: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    a1: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    pro_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    pro_source: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    a2: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    a3: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.0000'
    },
    a4: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    a5: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.0000'
    },
    a6: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    a7: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    a8: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    a9: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    a10: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.0000'
    },
    a11: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    a12: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    a13: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    a14: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    a15: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    a16: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    a17: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    a18: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    a19: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    a20: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    a21: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    manage_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    manage_user: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    verify_status: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    verify_num: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    verify1: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    verify1_manage_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    verify1_manage_user: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    verify2: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    verify2_manage_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    verify2_manage_user: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    verify3: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    verify3_manage_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    verify3_manage_user: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    verify1_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    verify2_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    verify3_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    verify1_remark: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    verify2_remark: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    verify3_remark: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    b1: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    b2: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    b3: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.0000'
    },
    b4: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    b5: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.00'
    },
    b6: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    b7: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    b8: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.00'
    },
    b9: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    b10: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    b11: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    b12: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    b13: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    b14: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    verify_sub_manageid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    verify_sub_manageuser: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    b15: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    b16: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    b17: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    b18: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    b19: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    b20: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    b21: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    b22: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ptype: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: '普通项目'
    }
  }, {
    tableName: 'info_projects'
  });
};
