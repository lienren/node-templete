const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_projects', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pro_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "项目代码",
      unique: "idx_pro_code"
    },
    pro_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "项目名称"
    },
    pro_level: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "优先级(高中低)"
    },
    pro_status: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "状态(投前跟进、投前暂缓、投前中止、项目立项、投后审核中、投后管理)"
    },
    a1: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "对接人"
    },
    pro_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "类型(股权投资,金融投资,招商引资,固定资产投资,股权管理,其他)"
    },
    pro_source: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "来源(区投促局,区商务局,区金融局,投资机构,券商,银行,单位内部,其他)"
    },
    a2: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "投资亮点"
    },
    a3: {
      type: DataTypes.DECIMAL(12,4),
      allowNull: true,
      defaultValue: 0.0000,
      comment: "融资金额(万元)"
    },
    a4: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "融资轮次(A轮)"
    },
    a5: {
      type: DataTypes.DECIMAL(12,4),
      allowNull: true,
      defaultValue: 0.0000,
      comment: "投资额度"
    },
    a6: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "最新进展"
    },
    a7: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "地区(省市区)"
    },
    a8: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "公司名称"
    },
    a9: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "注册地址"
    },
    a10: {
      type: DataTypes.DECIMAL(12,4),
      allowNull: true,
      defaultValue: 0.0000,
      comment: "注册资本(万元)"
    },
    a11: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "成立时间"
    },
    a12: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "主营业务"
    },
    a13: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "所属行业"
    },
    a14: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "对接时间"
    },
    a15: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "对接人员"
    },
    a16: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "职务"
    },
    a17: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "联系方式"
    },
    a18: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "对接方式(实地走访,电话,线上)"
    },
    a19: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "情况说明"
    },
    a20: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "形成文档"
    },
    a21: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "备注"
    },
    manage_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "管理员编号"
    },
    manage_user: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "管理员姓名"
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    verify_status: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "审核状态"
    },
    verify_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "审核次数(2,3)"
    },
    verify1: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "一审状态"
    },
    verify1_manage_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "一审管理员编号"
    },
    verify1_manage_user: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "一审管理员姓名"
    },
    verify2: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "二审状态"
    },
    verify2_manage_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "二审管理员编号"
    },
    verify2_manage_user: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "二审管理员姓名"
    },
    verify3: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "三审状态"
    },
    verify3_manage_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "三审管理员编号"
    },
    verify3_manage_user: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "三审管理员姓名"
    },
    verify1_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "一审状态时间"
    },
    verify2_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "二审状态时间"
    },
    verify3_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "三审状态时间"
    },
    verify1_remark: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "一审核结果说明"
    },
    verify2_remark: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "二审核结果说明"
    },
    verify3_remark: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "三审核结果说明"
    },
    b1: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "投资主体(国资集团,盛世融合)"
    },
    b2: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "投资时间"
    },
    b3: {
      type: DataTypes.DECIMAL(12,4),
      allowNull: true,
      defaultValue: 0.0000,
      comment: "投资金额(万元)"
    },
    b4: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "投资方式(股权投资,国债,理财,信托,其他)"
    },
    b5: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00,
      comment: "投资企业股权占比"
    },
    b6: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "投资途径(私募股权基金,直接投资)"
    },
    b7: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "基金管理人"
    },
    b8: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00,
      comment: "基金份额占比"
    },
    b9: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "合伙协议"
    },
    b10: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "增资协议"
    },
    b11: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "协议重要条款"
    },
    b12: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "公司内部流程文件"
    },
    b13: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "转入下一阶段(投后管理,招商引资)"
    },
    b14: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "备注"
    },
    verify_sub_manageid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "审核提交人编号"
    },
    verify_sub_manageuser: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "审核提交人姓名"
    },
    b15: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "投资计划"
    },
    b16: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "其他股东（合伙人）"
    },
    b17: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "投资建议书"
    },
    b18: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "尽职调查报告（可研报告）"
    },
    b19: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "初始投资时间"
    },
    b20: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "是否委派董事"
    },
    b21: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "是否委派监事"
    },
    b22: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "章程"
    },
    ptype: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "普通项目",
      comment: "类型"
    },
    is_del: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'info_projects',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "idx_pro_code",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "pro_code" },
        ]
      },
      {
        name: "idx_pro_status",
        using: "BTREE",
        fields: [
          { name: "pro_status" },
        ]
      },
      {
        name: "idx_pro_name",
        using: "BTREE",
        fields: [
          { name: "pro_name" },
        ]
      },
      {
        name: "idx_create_time",
        using: "BTREE",
        fields: [
          { name: "create_time" },
        ]
      },
      {
        name: "idx_update_time",
        using: "BTREE",
        fields: [
          { name: "update_time" },
        ]
      },
      {
        name: "idx_verify_status",
        using: "BTREE",
        fields: [
          { name: "verify_status" },
        ]
      },
      {
        name: "idx_verify_num",
        using: "BTREE",
        fields: [
          { name: "verify_num" },
        ]
      },
      {
        name: "idx_ptype",
        using: "BTREE",
        fields: [
          { name: "ptype" },
        ]
      },
      {
        name: "idx_a13",
        using: "BTREE",
        fields: [
          { name: "a13" },
        ]
      },
      {
        name: "idx_pro_type",
        using: "BTREE",
        fields: [
          { name: "pro_type" },
        ]
      },
      {
        name: "idx_pro_source",
        using: "BTREE",
        fields: [
          { name: "pro_source" },
        ]
      },
    ]
  });
};
