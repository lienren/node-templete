const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    info_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cx_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "主键"
    },
    batch_no: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "批次号"
    },
    batchName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "批次名称"
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "姓名"
    },
    cert_type: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "证件类型"
    },
    cert_no: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "证件号"
    },
    birthday: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "生日"
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "年龄"
    },
    sex: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "性别"
    },
    tel: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "电话"
    },
    nation: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "民族"
    },
    contact_name: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "紧急联系人"
    },
    contact_relation: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "与老人关系"
    },
    ga_area: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "户籍所在县市"
    },
    ga_organ: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "所属街道"
    },
    ga_town: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "所属社区"
    },
    ga_address: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "户籍地址"
    },
    addr_area: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "现居住县区市"
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "现居住地址"
    },
    abp0114: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "居住情况"
    },
    abp0113: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "婚姻情况"
    },
    aap0113: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "健康状况"
    },
    is_assessment: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "是否完成能力评估"
    },
    assessment_organ: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "评估机构名称"
    },
    cbp0101: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "服务工单号"
    },
    is_gpps: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "是否政府购买服务"
    },
    aap0114: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "老人类别"
    },
    abp0110: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "补贴标准"
    },
    aap0112: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "服务地址"
    },
    bae0104: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "服务机构名称"
    },
    bae0102: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "统一社会信用代码"
    },
    bbp0103: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "上门服务人员姓名"
    },
    bbp0102: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "上门服务人员身份证号码"
    },
    cbp0107: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "服务开始时间"
    },
    cbp0108: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "服务结束时间"
    },
    cbp0113: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "服务时长"
    },
    cag0105: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "服务类别"
    },
    cag0104: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "服务内容"
    },
    cbp0103: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "工单价格"
    },
    creator_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "档案创建时间"
    },
    flag: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    result: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    addr_organ: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "现居住所在乡镇街道"
    },
    gdid: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    IS_KCDJ: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "是否空巢留守"
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updateTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    cusId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "客服编号"
    },
    cusName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "客服名称"
    },
    opStatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "处理状态"
    },
    opStatusName: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "处理状态名称"
    },
    connectType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "接听类型"
    },
    qa1: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "本人"
    },
    qa2: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "是否享受上门服务"
    },
    qa3: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "享受服务项目"
    },
    qa4: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "服务次数\/月"
    },
    qa5: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "服务时长\/次"
    },
    qa6: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "服务人员是否固定"
    },
    qa7: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "服务人员是否着工作服、戴工牌"
    },
    qa8: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "服务员是否留下联系方式"
    },
    qa9: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "是否清楚提供服务的组织名称"
    },
    qa10: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "对服务人员整体评价"
    },
    qa11: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "服务意见和建议"
    },
    qa12: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "备注"
    },
    qa13: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "未提供服务情况"
    },
    cusTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "客服回访时间"
    },
    cusConnectNum: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "客服联系次数"
    },
    areaName: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "区域名称"
    },
    streetName: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "街道名称"
    },
    summary: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "总结"
    },
    tmp_data: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "暂存信息"
    },
    qa_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "回访批次"
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "原回访编号"
    },
    is_repair: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "是否修证"
    },
    is_wchf: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "是否完成电话回访"
    },
    contact_tel: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "紧急联系人联系方式"
    },
    is_slhgz: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "是否在2022年完成适老化改造"
    },
    is_jtylcw: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "是否享受家庭养老床位服务"
    }
  }, {
    sequelize,
    tableName: 'info_users',
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
        name: "idx_batchName",
        using: "BTREE",
        fields: [
          { name: "batchName" },
        ]
      },
      {
        name: "idx_batch_no",
        using: "BTREE",
        fields: [
          { name: "batch_no" },
        ]
      },
      {
        name: "idx_opStatus",
        using: "BTREE",
        fields: [
          { name: "opStatus" },
        ]
      },
      {
        name: "idx_connectType",
        using: "BTREE",
        fields: [
          { name: "connectType" },
        ]
      },
      {
        name: "idx_qa2",
        using: "BTREE",
        fields: [
          { name: "qa2" },
        ]
      },
      {
        name: "idx_qa10",
        using: "BTREE",
        fields: [
          { name: "qa10" },
        ]
      },
      {
        name: "idx_qa13",
        using: "BTREE",
        fields: [
          { name: "qa13" },
        ]
      },
      {
        name: "idx_areaName",
        using: "BTREE",
        fields: [
          { name: "areaName" },
        ]
      },
      {
        name: "idx_name",
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "idx_tel",
        using: "BTREE",
        fields: [
          { name: "tel" },
        ]
      },
      {
        name: "idx_cert_no",
        using: "BTREE",
        fields: [
          { name: "cert_no" },
        ]
      },
      {
        name: "idx_cusId",
        using: "BTREE",
        fields: [
          { name: "cusId" },
        ]
      },
      {
        name: "idx_cusName",
        using: "BTREE",
        fields: [
          { name: "cusName" },
        ]
      },
      {
        name: "idx_cusTime",
        using: "BTREE",
        fields: [
          { name: "cusTime" },
        ]
      },
      {
        name: "idx_isRepair",
        using: "BTREE",
        fields: [
          { name: "is_repair" },
        ]
      },
      {
        name: "idx_qaNum",
        using: "BTREE",
        fields: [
          { name: "qa_num" },
        ]
      },
      {
        name: "idx_createTime",
        using: "BTREE",
        fields: [
          { name: "createTime" },
        ]
      },
    ]
  });
};
