/*
 * @Author: Lienren
 * @Date: 2019-04-02 17:35:45
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-09-16 17:35:39
 */
'use strict';

const qs = require('qs');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const http = require('../../utils/http');
const validate = require('../../utils/validate');

// Ler@2019

const attrTypes = {
  '1': '团建',
  '2': '活动',
  '3': '场地',
  '4': '亲子汇',
  '5': '案例'
};

const classTypes = {
  '1': '办年会'
};

const orderType = {
  '99': '无类型',
  '1': '团建类型',
  '2': '活动类型',
  '3': '场地类型',
  '4': '亲子汇类型',
  '5': '案例类型'
};

const orderState = {
  '1': '未处理',
  '2': '处理中',
  '3': '已完成'
};

const fileUtils = {
  read: filePath => {
    let content = null;

    if (fs.existsSync(filePath)) {
      content = fs.readFileSync(filePath, { encoding: 'utf8' });
    }

    return content;
  },
  write: (filePath, fileContent) => {
    fs.writeFileSync(filePath, fileContent, { encoding: 'utf8' });

    return true;
  }
};

module.exports = {
  addAttr: async ctx => {
    let attrName = ctx.request.body.attrName || '';
    let attrType = ctx.request.body.attrType || 1;
    let attrSort = ctx.request.body.attrSort || 0;
    let isCheck = ctx.request.body.isCheck || 0;

    assert.notStrictEqual(attrName, '', '入参不正确！');

    let now = date.getTimeStamp();

    let result = await ctx.orm().PlayAttr.create({
      attrName,
      attrType,
      isCheck,
      attrSort,
      createTime: now,
      isDel: 0
    });

    ctx.body = {};
  },
  delAttr: async ctx => {
    let id = ctx.request.body.id || 0;

    assert.notStrictEqual(id, 0, '入参不正确！');

    let now = date.getTimeStamp();

    await ctx.orm().PlayAttr.update(
      {
        isDel: 1
      },
      {
        where: { id: id }
      }
    );

    await ctx.orm().PlayAttrValue.update(
      {
        isDel: 1
      },
      {
        where: { attrId: id }
      }
    );

    ctx.body = {};
  },
  getAttr: async ctx => {
    let attrId = ctx.request.body.attrId || 0;
    let attrType = ctx.request.body.attrType || 0;
    let current = ctx.request.body.current || 1;
    let pageSize = ctx.request.body.pageSize || 20;

    let where = {
      isDel: 0
    };
    if (attrId > 0) {
      where.id = attrId;
    }

    if (attrType > 0) {
      where.attrType = attrType;
    }

    let result = await ctx.orm().PlayAttr.findAll({
      where
    });

    let attrs = [];
    for (let i = 0, j = result.length; i < j; i++) {
      attrs.push({
        id: result[i].id,
        attrName: result[i].attrName,
        attrType: result[i].attrType,
        attrSort: result[i].attrSort,
        isCheck: result[i].isCheck,
        createTime: result[i].createTime,
        isDel: result[i].isDel
      });
      let resultAttrValue = await ctx.orm().PlayAttrValue.findAll({
        where: {
          attrId: attrs[i].id,
          isDel: 0
        }
      });

      attrs[i].attrValues = resultAttrValue;
    }

    ctx.body = {
      current,
      pageSize,
      total: attrs.length,
      list: attrs
    };
  },
  addAttrValue: async ctx => {
    let attrId = ctx.request.body.attrId || 0;
    let attrValues = ctx.request.body.attrValues || [];

    assert.notStrictEqual(attrId, 0, '入参不正确！');

    let now = date.getTimeStamp();

    let attr = await ctx.orm().PlayAttr.findOne({
      where: {
        id: attrId
      }
    });

    if (attr) {
      let now = date.getTimeStamp();

      for (let i = 0, j = attrValues.length; i < j; i++) {
        await ctx.orm().PlayAttrValue.create({
          attrId: attr.id,
          attrName: attr.attrName,
          attrType: attr.attrType,
          attrValue: attrValues[i],
          attrSort: 0,
          createTime: now,
          isDel: 0
        });
      }
    }

    ctx.body = {};
  },
  delAttrValue: async ctx => {
    let id = ctx.request.body.id || 0;
    let attrId = ctx.request.body.attrId || 0;

    let now = date.getTimeStamp();

    let where = {};

    if (id > 0) {
      where.id = id;
    }

    if (attrId > 0) {
      where.attrId = attrId;
    }

    await ctx.orm().PlayAttrValue.update(
      {
        isDel: 1
      },
      {
        where
      }
    );

    ctx.body = {};
  },
  getAttrValue: async ctx => {
    let attrId = ctx.request.body.attrId || 0;
    let attrType = ctx.request.body.attrType || 0;

    let where = {
      isDel: 0
    };
    if (attrId > 0) {
      where.attrId = attrId;
    }

    if (attrType > 0) {
      where.attrType = attrType;
    }

    let result = await ctx.orm().PlayAttrValue.findAll({
      where
    });

    ctx.body = result;
  },
  getBusinessUser: async ctx => {
    let current = ctx.request.body.current || 1;
    let pageSize = ctx.request.body.pageSize || 20;

    let where = {
      isDel: 0
    };

    let resultCount = await ctx.orm().PlayBusinessUser.findAndCountAll({
      where
    });
    let result = await ctx.orm().PlayBusinessUser.findAll({
      offset: (current - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['createTime', 'DESC']]
    });

    ctx.body = {
      total: resultCount.count,
      list: result,
      current,
      pageSize
    };
  },
  addBusinessUser: async ctx => {
    let busName = ctx.request.body.busName || '';
    let busPhone = ctx.request.body.busPhone || '';
    let busTitle = ctx.request.body.busTitle || '';
    let busContent = ctx.request.body.busContent || '';
    let busHeadImg = ctx.request.body.busHeadImg || '';

    assert.notStrictEqual(busName, '', '入参不正确！');
    assert.notStrictEqual(busPhone, '', '入参不正确！');
    assert.notStrictEqual(busTitle, '', '入参不正确！');
    assert.notStrictEqual(busContent, '', '入参不正确！');
    assert.notStrictEqual(busHeadImg, '', '入参不正确！');

    let now = date.getTimeStamp();

    await ctx.orm().PlayBusinessUser.create({
      busName,
      busPhone,
      busTitle,
      busContent,
      busHeadImg,
      createTime: now,
      isDel: 0
    });

    ctx.body = {};
  },
  editBusinessUser: async ctx => {
    let id = ctx.request.body.id || 0;
    let busName = ctx.request.body.busName || '';
    let busPhone = ctx.request.body.busPhone || '';
    let busTitle = ctx.request.body.busTitle || '';
    let busContent = ctx.request.body.busContent || '';
    let busHeadImg = ctx.request.body.busHeadImg || '';

    assert.notStrictEqual(id, 0, '入参不正确！');
    assert.notStrictEqual(busName, '', '入参不正确！');
    assert.notStrictEqual(busPhone, '', '入参不正确！');
    assert.notStrictEqual(busTitle, '', '入参不正确！');
    assert.notStrictEqual(busContent, '', '入参不正确！');
    assert.notStrictEqual(busHeadImg, '', '入参不正确！');

    let now = date.getTimeStamp();

    await ctx.orm().PlayBusinessUser.update(
      {
        busName,
        busPhone,
        busTitle,
        busContent,
        busHeadImg
      },
      {
        where: {
          id: id
        }
      }
    );

    ctx.body = {};
  },
  delBusinessUser: async ctx => {
    let id = ctx.request.body.id || 0;

    assert.notStrictEqual(id, 0, '入参不正确！');

    await ctx.orm().PlayBusinessUser.update(
      {
        isDel: 1
      },
      {
        where: { id: id }
      }
    );

    ctx.body = {};
  },
  getUser: async ctx => {
    let current = ctx.request.body.current || 1;
    let pageSize = ctx.request.body.pageSize || 20;

    let where = {
      isDel: 0
    };

    let resultCount = await ctx.orm().PlayUser.findAndCountAll({
      where
    });
    let result = await ctx.orm().PlayUser.findAll({
      offset: (current - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['createTime', 'DESC']]
    });

    ctx.body = {
      total: resultCount.count,
      list: result,
      current,
      pageSize
    };
  },
  delUser: async ctx => {
    let id = ctx.request.body.id || 0;

    assert.notStrictEqual(id, 0, '入参不正确！');

    await ctx.orm().PlayUser.update(
      {
        isDel: 1
      },
      {
        where: { id: id }
      }
    );

    ctx.body = {};
  },
  getPlayGroup: async ctx => {
    let current = ctx.request.body.current || 1;
    let pageSize = ctx.request.body.pageSize || 20;

    let where = {
      isDel: 0
    };

    let resultCount = await ctx.orm().PlayGroup.findAndCountAll({
      where
    });
    let result = await ctx.orm().PlayGroup.findAll({
      // attributes: ['id', 'title', 'price', 'score', 'strokeDay', 'createTime'],
      offset: (current - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['createTime', 'DESC']]
    });

    ctx.body = {
      total: resultCount.count,
      list: result,
      current,
      pageSize
    };
  },
  getPlayGroupDetail: async ctx => {
    let id = ctx.request.body.id || 0;

    assert.notStrictEqual(id, 0, '入参不正确！');

    let result = await ctx.orm().PlayGroup.findOne({
      where: {
        id: id,
        isDel: 0
      }
    });

    ctx.body = result;
  },
  addPlayGroup: async ctx => {
    let title = ctx.request.body.title || '';
    let subTitle = ctx.request.body.subTitle || '';
    let price = ctx.request.body.price || 0;
    let score = ctx.request.body.score || 0;
    let reason = ctx.request.body.reason || '';
    let strokeDay = ctx.request.body.strokeDay || 0;
    let minPeopleNum = ctx.request.body.minPeopleNum || 0;
    let maxPeopleNum = ctx.request.body.maxPeopleNum || 0;
    let masterImg = ctx.request.body.masterImg || '';
    let subImg = ctx.request.body.subImg || '';
    let r1 = ctx.request.body.r1 || '';
    let r2 = ctx.request.body.r2 || '';
    let r3 = ctx.request.body.r3 || '';
    let r4 = ctx.request.body.r4 || '';
    let attrs = ctx.request.body.attrs || [];
    let tags = ctx.request.body.tags || '';
    let busUserId = ctx.request.body.busUserId || 0;
    let packAge = ctx.request.body.packAge || [];

    assert.notStrictEqual(title, '', '入参不正确！');
    assert.notStrictEqual(masterImg, '', '入参不正确！');

    let now = date.getTimeStamp();

    await ctx.orm().PlayGroup.create({
      title,
      subTitle,
      price,
      score,
      reason,
      strokeDay,
      minPeopleNum,
      maxPeopleNum,
      masterImg,
      subImg,
      r1,
      r2,
      r3,
      r4,
      attrs: JSON.stringify(attrs),
      tags,
      createTime: now,
      isDel: 0,
      busUserId,
      packAge: JSON.stringify(packAge)
    });

    ctx.body = {};
  },
  editPlayGroup: async ctx => {
    let id = ctx.request.body.id || 0;
    let title = ctx.request.body.title || '';
    let subTitle = ctx.request.body.subTitle || '';
    let price = ctx.request.body.price || 0;
    let score = ctx.request.body.score || 0;
    let reason = ctx.request.body.reason || '';
    let strokeDay = ctx.request.body.strokeDay || 0;
    let minPeopleNum = ctx.request.body.minPeopleNum || 0;
    let maxPeopleNum = ctx.request.body.maxPeopleNum || 0;
    let masterImg = ctx.request.body.masterImg || '';
    let subImg = ctx.request.body.subImg || '';
    let r1 = ctx.request.body.r1 || '';
    let r2 = ctx.request.body.r2 || '';
    let r3 = ctx.request.body.r3 || '';
    let r4 = ctx.request.body.r4 || '';
    let attrs = ctx.request.body.attrs || [];
    let tags = ctx.request.body.tags || '';
    let busUserId = ctx.request.body.busUserId || 0;
    let packAge = ctx.request.body.packAge || [];

    assert.notStrictEqual(id, 0, '入参不正确！');
    assert.notStrictEqual(title, '', '入参不正确！');
    assert.notStrictEqual(masterImg, '', '入参不正确！');

    await ctx.orm().PlayGroup.update(
      {
        title,
        subTitle,
        price,
        score,
        reason,
        strokeDay,
        minPeopleNum,
        maxPeopleNum,
        masterImg,
        subImg,
        r1,
        r2,
        r3,
        r4,
        attrs: JSON.stringify(attrs),
        tags,
        busUserId,
        packAge: JSON.stringify(packAge)
      },
      {
        where: {
          id: id
        }
      }
    );

    ctx.body = {};
  },
  delPlayGroup: async ctx => {
    let id = ctx.request.body.id || 0;

    assert.notStrictEqual(id, 0, '入参不正确！');

    await ctx.orm().PlayGroup.update(
      {
        isDel: 1
      },
      {
        where: {
          id: id
        }
      }
    );

    ctx.body = {};
  },
  getPlaySite: async ctx => {
    let current = ctx.request.body.current || 1;
    let pageSize = ctx.request.body.pageSize || 20;

    let where = {
      isDel: 0
    };

    let resultCount = await ctx.orm().PlaySite.findAndCountAll({
      where
    });
    let result = await ctx.orm().PlaySite.findAll({
      // attributes: ['id', 'title', 'price', 'size', 'height', 'peopleNum', 'createTime'],
      offset: (current - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['createTime', 'DESC']]
    });

    ctx.body = {
      total: resultCount.count,
      list: result,
      current,
      pageSize
    };
  },
  getPlaySiteDetail: async ctx => {
    let id = ctx.request.body.id || 0;

    assert.notStrictEqual(id, 0, '入参不正确！');

    let result = await ctx.orm().PlaySite.findOne({
      where: {
        id: id,
        isDel: 0
      }
    });

    ctx.body = result;
  },
  addPlaySite: async ctx => {
    let title = ctx.request.body.title || '';
    let subTitle = ctx.request.body.subTitle || '';
    let price = ctx.request.body.price || 0;
    let address = ctx.request.body.address || '';
    let workTime = ctx.request.body.workTime || '';
    let openTime = ctx.request.body.openTime || '';
    let masterImg = ctx.request.body.masterImg || '';
    let subImg = ctx.request.body.subImg || '';
    let size = ctx.request.body.size || 0;
    let height = ctx.request.body.height || 0;
    let peopleNum = ctx.request.body.peopleNum || 0;
    let r1 = ctx.request.body.r1 || '';
    let r2 = ctx.request.body.r2 || '';
    let r3 = ctx.request.body.r3 || '';
    let r4 = ctx.request.body.r4 || '';
    let attrs = ctx.request.body.attrs || [];
    let tags = ctx.request.body.tags || '';
    let busUserId = ctx.request.body.busUserId || 0;
    let packAge = ctx.request.body.packAge || [];

    assert.notStrictEqual(title, '', '入参不正确！');
    assert.notStrictEqual(masterImg, '', '入参不正确！');

    let now = date.getTimeStamp();

    await ctx.orm().PlaySite.create({
      title,
      subTitle,
      price,
      address,
      workTime,
      openTime,
      masterImg,
      subImg,
      size,
      height,
      peopleNum,
      r1,
      r2,
      r3,
      r4,
      attrs: JSON.stringify(attrs),
      tags,
      createTime: now,
      isDel: 0,
      busUserId,
      packAge: JSON.stringify(packAge)
    });

    ctx.body = {};
  },
  editPlaySite: async ctx => {
    let id = ctx.request.body.id || 0;
    let title = ctx.request.body.title || '';
    let subTitle = ctx.request.body.subTitle || '';
    let price = ctx.request.body.price || 0;
    let address = ctx.request.body.address || '';
    let workTime = ctx.request.body.workTime || '';
    let openTime = ctx.request.body.openTime || '';
    let masterImg = ctx.request.body.masterImg || '';
    let subImg = ctx.request.body.subImg || '';
    let size = ctx.request.body.size || 0;
    let height = ctx.request.body.height || 0;
    let peopleNum = ctx.request.body.peopleNum || 0;
    let r1 = ctx.request.body.r1 || '';
    let r2 = ctx.request.body.r2 || '';
    let r3 = ctx.request.body.r3 || '';
    let r4 = ctx.request.body.r4 || '';
    let attrs = ctx.request.body.attrs || [];
    let tags = ctx.request.body.tags || '';
    let busUserId = ctx.request.body.busUserId || 0;
    let packAge = ctx.request.body.packAge || [];

    assert.notStrictEqual(id, 0, '入参不正确！');
    assert.notStrictEqual(title, '', '入参不正确！');
    assert.notStrictEqual(masterImg, '', '入参不正确！');

    await ctx.orm().PlaySite.update(
      {
        title,
        subTitle,
        price,
        address,
        workTime,
        openTime,
        masterImg,
        subImg,
        size,
        height,
        peopleNum,
        r1,
        r2,
        r3,
        r4,
        attrs: JSON.stringify(attrs),
        tags,
        busUserId,
        packAge: JSON.stringify(packAge)
      },
      {
        where: {
          id: id
        }
      }
    );

    ctx.body = {};
  },
  delPlaySite: async ctx => {
    let id = ctx.request.body.id || 0;

    assert.notStrictEqual(id, 0, '入参不正确！');

    await ctx.orm().PlaySite.update(
      {
        isDel: 1
      },
      {
        where: {
          id: id
        }
      }
    );

    ctx.body = {};
  },
  getPlayActivity: async ctx => {
    let current = ctx.request.body.current || 1;
    let pageSize = ctx.request.body.pageSize || 20;

    let where = {
      isDel: 0
    };

    let resultCount = await ctx.orm().PlayActivity.findAndCountAll({
      where
    });
    let result = await ctx.orm().PlayActivity.findAll({
      // attributes: ['id', 'title', 'price', 'clsName', 'strokeDay', 'site', 'createTime'],
      offset: (current - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['createTime', 'DESC']]
    });

    ctx.body = {
      total: resultCount.count,
      list: result,
      current,
      pageSize
    };
  },
  getPlayActivityDetail: async ctx => {
    let id = ctx.request.body.id || 0;

    assert.notStrictEqual(id, 0, '入参不正确！');

    let result = await ctx.orm().PlayActivity.findOne({
      where: {
        id: id,
        isDel: 0
      }
    });

    ctx.body = result;
  },
  addPlayActivity: async ctx => {
    let title = ctx.request.body.title || '';
    let subTitle = ctx.request.body.subTitle || '';
    let clsId = ctx.request.body.clsId || 0;
    let clsName = ctx.request.body.clsName || '';
    let price = ctx.request.body.price || 0;
    let strokeDay = ctx.request.body.strokeDay || 0;
    let site = ctx.request.body.site || '';
    let masterImg = ctx.request.body.masterImg || '';
    let subImg = ctx.request.body.subImg || '';
    let r1 = ctx.request.body.r1 || '';
    let r2 = ctx.request.body.r2 || '';
    let r3 = ctx.request.body.r3 || '';
    let r4 = ctx.request.body.r4 || '';
    let attrs = ctx.request.body.attrs || [];
    let tags = ctx.request.body.tags || '';
    let busUserId = ctx.request.body.busUserId || 0;
    let packAge = ctx.request.body.packAge || [];

    assert.notStrictEqual(title, '', '入参不正确！');
    assert.notStrictEqual(masterImg, '', '入参不正确！');

    let now = date.getTimeStamp();

    await ctx.orm().PlayActivity.create({
      title,
      subTitle,
      clsId,
      clsName,
      price,
      strokeDay,
      site,
      masterImg,
      subImg,
      r1,
      r2,
      r3,
      r4,
      attrs: JSON.stringify(attrs),
      tags,
      createTime: now,
      isDel: 0,
      busUserId,
      packAge: JSON.stringify(packAge)
    });

    ctx.body = {};
  },
  editPlayActivity: async ctx => {
    let id = ctx.request.body.id || 0;
    let title = ctx.request.body.title || '';
    let subTitle = ctx.request.body.subTitle || '';
    let clsId = ctx.request.body.clsId || 0;
    let clsName = ctx.request.body.clsName || '';
    let price = ctx.request.body.price || 0;
    let strokeDay = ctx.request.body.strokeDay || 0;
    let site = ctx.request.body.site || '';
    let masterImg = ctx.request.body.masterImg || '';
    let subImg = ctx.request.body.subImg || '';
    let r1 = ctx.request.body.r1 || '';
    let r2 = ctx.request.body.r2 || '';
    let r3 = ctx.request.body.r3 || '';
    let r4 = ctx.request.body.r4 || '';
    let attrs = ctx.request.body.attrs || [];
    let tags = ctx.request.body.tags || '';
    let busUserId = ctx.request.body.busUserId || 0;
    let packAge = ctx.request.body.packAge || [];

    assert.notStrictEqual(id, 0, '入参不正确！');
    assert.notStrictEqual(title, '', '入参不正确！');
    assert.notStrictEqual(masterImg, '', '入参不正确！');

    let now = date.getTimeStamp();

    await ctx.orm().PlayActivity.update(
      {
        title,
        subTitle,
        clsId,
        clsName,
        price,
        strokeDay,
        site,
        masterImg,
        subImg,
        r1,
        r2,
        r3,
        r4,
        attrs: JSON.stringify(attrs),
        tags,
        createTime: now,
        isDel: 0,
        busUserId,
        packAge: JSON.stringify(packAge)
      },
      {
        where: {
          id: id
        }
      }
    );

    ctx.body = {};
  },
  delPlayActivity: async ctx => {
    let id = ctx.request.body.id || 0;

    assert.notStrictEqual(id, 0, '入参不正确！');

    await ctx.orm().PlayActivity.update(
      {
        isDel: 1
      },
      {
        where: {
          id: id
        }
      }
    );

    ctx.body = {};
  },
  getPlayParentChild: async ctx => {
    let current = ctx.request.body.current || 1;
    let pageSize = ctx.request.body.pageSize || 20;

    let where = {
      isDel: 0
    };

    let resultCount = await ctx.orm().PlayParentChild.findAndCountAll({
      where
    });
    let result = await ctx.orm().PlayParentChild.findAll({
      // attributes: ['id', 'title', 'price', 'score', 'strokeDay', 'createTime'],
      offset: (current - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['createTime', 'DESC']]
    });

    ctx.body = {
      total: resultCount.count,
      list: result,
      current,
      pageSize
    };
  },
  getPlayParentChildDetail: async ctx => {
    let id = ctx.request.body.id || 0;

    assert.notStrictEqual(id, 0, '入参不正确！');

    let result = await ctx.orm().PlayParentChild.findOne({
      where: {
        id: id,
        isDel: 0
      }
    });

    ctx.body = result;
  },
  addPlayParentChild: async ctx => {
    let title = ctx.request.body.title || '';
    let subTitle = ctx.request.body.subTitle || '';
    let price = ctx.request.body.price || 0;
    let score = ctx.request.body.score || 0;
    let reason = ctx.request.body.reason || '';
    let strokeDay = ctx.request.body.strokeDay || 0;
    let minPeopleNum = ctx.request.body.minPeopleNum || 0;
    let maxPeopleNum = ctx.request.body.maxPeopleNum || 0;
    let masterImg = ctx.request.body.masterImg || '';
    let subImg = ctx.request.body.subImg || '';
    let r1 = ctx.request.body.r1 || '';
    let r2 = ctx.request.body.r2 || '';
    let r3 = ctx.request.body.r3 || '';
    let r4 = ctx.request.body.r4 || '';
    let attrs = ctx.request.body.attrs || [];
    let tags = ctx.request.body.tags || '';
    let busUserId = ctx.request.body.busUserId || 0;
    let packAge = ctx.request.body.packAge || [];

    assert.notStrictEqual(title, '', '入参不正确！');
    assert.notStrictEqual(masterImg, '', '入参不正确！');

    let now = date.getTimeStamp();

    await ctx.orm().PlayParentChild.create({
      title,
      subTitle,
      price,
      score,
      reason,
      strokeDay,
      minPeopleNum,
      maxPeopleNum,
      masterImg,
      subImg,
      r1,
      r2,
      r3,
      r4,
      attrs: JSON.stringify(attrs),
      tags,
      createTime: now,
      isDel: 0,
      busUserId,
      packAge: JSON.stringify(packAge)
    });

    ctx.body = {};
  },
  editPlayParentChild: async ctx => {
    let id = ctx.request.body.id || 0;
    let title = ctx.request.body.title || '';
    let subTitle = ctx.request.body.subTitle || '';
    let price = ctx.request.body.price || 0;
    let score = ctx.request.body.score || 0;
    let reason = ctx.request.body.reason || '';
    let strokeDay = ctx.request.body.strokeDay || 0;
    let minPeopleNum = ctx.request.body.minPeopleNum || 0;
    let maxPeopleNum = ctx.request.body.maxPeopleNum || 0;
    let masterImg = ctx.request.body.masterImg || '';
    let subImg = ctx.request.body.subImg || '';
    let r1 = ctx.request.body.r1 || '';
    let r2 = ctx.request.body.r2 || '';
    let r3 = ctx.request.body.r3 || '';
    let r4 = ctx.request.body.r4 || '';
    let attrs = ctx.request.body.attrs || [];
    let tags = ctx.request.body.tags || '';
    let busUserId = ctx.request.body.busUserId || 0;
    let packAge = ctx.request.body.packAge || [];

    assert.notStrictEqual(id, 0, '入参不正确！');
    assert.notStrictEqual(title, '', '入参不正确！');
    assert.notStrictEqual(masterImg, '', '入参不正确！');

    await ctx.orm().PlayParentChild.update(
      {
        title,
        subTitle,
        price,
        score,
        reason,
        strokeDay,
        minPeopleNum,
        maxPeopleNum,
        masterImg,
        subImg,
        r1,
        r2,
        r3,
        r4,
        attrs: JSON.stringify(attrs),
        tags,
        busUserId,
        packAge: JSON.stringify(packAge)
      },
      {
        where: {
          id: id
        }
      }
    );

    ctx.body = {};
  },
  delPlayParentChild: async ctx => {
    let id = ctx.request.body.id || 0;

    assert.notStrictEqual(id, 0, '入参不正确！');

    await ctx.orm().PlayParentChild.update(
      {
        isDel: 1
      },
      {
        where: {
          id: id
        }
      }
    );

    ctx.body = {};
  },
  getPlayCase: async ctx => {
    let current = ctx.request.body.current || 1;
    let pageSize = ctx.request.body.pageSize || 20;

    let where = {
      isDel: 0
    };

    let resultCount = await ctx.orm().PlayCase.findAndCountAll({
      where
    });
    let result = await ctx.orm().PlayCase.findAll({
      // attributes: ['id', 'title', 'price', 'score', 'strokeDay', 'createTime'],
      offset: (current - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['createTime', 'DESC']]
    });

    ctx.body = {
      total: resultCount.count,
      list: result,
      current,
      pageSize
    };
  },
  getPlayCaseDetail: async ctx => {
    let id = ctx.request.body.id || 0;

    assert.notStrictEqual(id, 0, '入参不正确！');

    let result = await ctx.orm().PlayCase.findOne({
      where: {
        id: id,
        isDel: 0
      }
    });

    ctx.body = result;
  },
  addPlayCase: async ctx => {
    let title = ctx.request.body.title || '';
    let subTitle = ctx.request.body.subTitle || '';
    let price = ctx.request.body.price || 0;
    let score = ctx.request.body.score || 0;
    let reason = ctx.request.body.reason || '';
    let strokeDay = ctx.request.body.strokeDay || 0;
    let minPeopleNum = ctx.request.body.minPeopleNum || 0;
    let maxPeopleNum = ctx.request.body.maxPeopleNum || 0;
    let masterImg = ctx.request.body.masterImg || '';
    let subImg = ctx.request.body.subImg || '';
    let r1 = ctx.request.body.r1 || '';
    let r2 = ctx.request.body.r2 || '';
    let r3 = ctx.request.body.r3 || '';
    let r4 = ctx.request.body.r4 || '';
    let attrs = ctx.request.body.attrs || [];
    let tags = ctx.request.body.tags || '';
    let busUserId = ctx.request.body.busUserId || 0;
    let packAge = ctx.request.body.packAge || [];

    assert.notStrictEqual(title, '', '入参不正确！');
    assert.notStrictEqual(masterImg, '', '入参不正确！');

    let now = date.getTimeStamp();

    await ctx.orm().PlayCase.create({
      title,
      subTitle,
      price,
      score,
      reason,
      strokeDay,
      minPeopleNum,
      maxPeopleNum,
      masterImg,
      subImg,
      r1,
      r2,
      r3,
      r4,
      attrs: JSON.stringify(attrs),
      tags,
      createTime: now,
      isDel: 0,
      busUserId,
      packAge: JSON.stringify(packAge)
    });

    ctx.body = {};
  },
  editPlayCase: async ctx => {
    let id = ctx.request.body.id || 0;
    let title = ctx.request.body.title || '';
    let subTitle = ctx.request.body.subTitle || '';
    let price = ctx.request.body.price || 0;
    let score = ctx.request.body.score || 0;
    let reason = ctx.request.body.reason || '';
    let strokeDay = ctx.request.body.strokeDay || 0;
    let minPeopleNum = ctx.request.body.minPeopleNum || 0;
    let maxPeopleNum = ctx.request.body.maxPeopleNum || 0;
    let masterImg = ctx.request.body.masterImg || '';
    let subImg = ctx.request.body.subImg || '';
    let r1 = ctx.request.body.r1 || '';
    let r2 = ctx.request.body.r2 || '';
    let r3 = ctx.request.body.r3 || '';
    let r4 = ctx.request.body.r4 || '';
    let attrs = ctx.request.body.attrs || [];
    let tags = ctx.request.body.tags || '';
    let busUserId = ctx.request.body.busUserId || 0;
    let packAge = ctx.request.body.packAge || [];

    assert.notStrictEqual(id, 0, '入参不正确！');
    assert.notStrictEqual(title, '', '入参不正确！');
    assert.notStrictEqual(masterImg, '', '入参不正确！');

    await ctx.orm().PlayCase.update(
      {
        title,
        subTitle,
        price,
        score,
        reason,
        strokeDay,
        minPeopleNum,
        maxPeopleNum,
        masterImg,
        subImg,
        r1,
        r2,
        r3,
        r4,
        attrs: JSON.stringify(attrs),
        tags,
        busUserId,
        packAge: JSON.stringify(packAge)
      },
      {
        where: {
          id: id
        }
      }
    );

    ctx.body = {};
  },
  delPlayCase: async ctx => {
    let id = ctx.request.body.id || 0;

    assert.notStrictEqual(id, 0, '入参不正确！');

    await ctx.orm().PlayCase.update(
      {
        isDel: 1
      },
      {
        where: {
          id: id
        }
      }
    );

    ctx.body = {};
  },
  getIndexBannerLink: async ctx => {
    let content = fileUtils.read(path.resolve(__dirname, '../../../assets/indexBannerLink.json'));

    if (content) {
      content = JSON.parse(content);
    } else {
      content = [
        {
          url: '',
          imgUrl: ''
        },
        {
          url: '',
          imgUrl: ''
        },
        {
          url: '',
          imgUrl: ''
        },
        {
          url: '',
          imgUrl: ''
        }
      ];
    }

    ctx.body = content;
  },
  setIndexBannerLink: async ctx => {
    let bannerLink = ctx.request.body.bannerLink || [];

    if (bannerLink.length === 0) {
      bannerLink = [
        {
          url: '',
          imgUrl: ''
        },
        {
          url: '',
          imgUrl: ''
        },
        {
          url: '',
          imgUrl: ''
        },
        {
          url: '',
          imgUrl: ''
        }
      ];
    }

    fileUtils.write(path.resolve(__dirname, '../../../assets/indexBannerLink.json'), JSON.stringify(bannerLink));
  },
  getIndexBigBannerLink: async ctx => {
    let content = fileUtils.read(path.resolve(__dirname, '../../../assets/indexBigBannerLink.json'));

    if (content) {
      content = JSON.parse(content);
    } else {
      content = [
        {
          url: '',
          imgUrl: ''
        },
        {
          url: '',
          imgUrl: ''
        },
        {
          url: '',
          imgUrl: ''
        },
        {
          url: '',
          imgUrl: ''
        }
      ];
    }

    ctx.body = content;
  },
  setIndexBigBannerLink: async ctx => {
    let bannerLink = ctx.request.body.bannerLink || [];

    if (bannerLink.length === 0) {
      bannerLink = [
        {
          url: '',
          imgUrl: ''
        },
        {
          url: '',
          imgUrl: ''
        },
        {
          url: '',
          imgUrl: ''
        },
        {
          url: '',
          imgUrl: ''
        }
      ];
    }

    fileUtils.write(path.resolve(__dirname, '../../../assets/indexBigBannerLink.json'), JSON.stringify(bannerLink));
  },
  getOrder: async ctx => {
    let otype = ctx.request.body.otype || 0;
    let ostate = ctx.request.body.ostate || 0;
    let current = ctx.request.body.current || 1;
    let pageSize = ctx.request.body.pageSize || 20;

    let where = {
      isDel: 0
    };

    if (otype > 0) {
      where.otype = otype;
    }

    if (ostate > 0) {
      where.ostate = ostate;
    }

    let resultCount = await ctx.orm().PlayOrders.findAndCountAll({
      where
    });
    let result = await ctx.orm().PlayOrders.findAll({
      offset: (current - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['createTime', 'DESC']]
    });

    ctx.body = {
      total: resultCount.count,
      list: result,
      current,
      pageSize
    };
  },
  addOrder: async ctx => {
    let now = date.getTimeStamp();
    let osn = `PY${now}`;
    let otype = ctx.request.body.otype || 99;
    let otypeName = orderType[`${otype}`];
    let opeopleNum = ctx.request.body.opeopleNum || 0;
    let oprice = ctx.request.body.oprice || 0;
    let oselectTime = ctx.request.body.oselectTime || '未选择时间';
    let oselectDay = ctx.request.body.oselectDay || 0;
    let userId = ctx.request.body.userId || 0;
    let userPhone = ctx.request.body.userPhone || '';
    let userName = ctx.request.body.userName || '';
    let oprojectId = ctx.request.body.oprojectId || 0;
    let oprojectName = ctx.request.body.oprojectName || '未选择项目';
    let oprojectPageAge =
      ctx.request.body.oprojectPageAge || '{"title":"未选择套餐","remark":"","price":"0","unit":"/人"}';
    let oprojectBusUserId = ctx.request.body.oprojectBusUserId || 0;
    let oprojectBusUserName = ctx.request.body.oprojectBusUserName || '无业务人员';
    let oprojectBusUserInfo = ctx.request.body.oprojectBusUserInfo || '{}';
    let ostate = 1;
    let ostateName = orderState[`${ostate}`];

    ctx.orm().PlayOrders.create({
      osn,
      otype,
      otypeName,
      opeopleNum,
      oprice,
      oselectTime,
      oselectDay,
      userId,
      userPhone,
      userName,
      oprojectId,
      oprojectName,
      oprojectPageAge,
      oprojectBusUserId,
      oprojectBusUserName,
      oprojectBusUserInfo,
      ostate,
      ostateName,
      createTime: now,
      isDel: 0
    });

    ctx.body = {};
  },
  updateOrderState: async ctx => {
    let id = ctx.request.body.id || 0;
    let ostate = ctx.request.body.ostate || 1;

    assert.notStrictEqual(id, 0, '入参不正确！');

    await ctx.orm().PlayOrders.update(
      {
        ostate: ostate,
        ostateName: orderState[`${ostate}`]
      },
      {
        where: {
          id: id,
          isDel: 0
        }
      }
    );

    let now = date.getTimeStamp();
    ctx.orm().PlayOrderRemark.create({
      orderId: id,
      remark: orderState[`${ostate}`],
      manageId: ctx.work.managerId,
      manageName: ctx.work.managerRealName,
      createTime: now
    });

    ctx.body = {};
  },
  addOrderRemark: async ctx => {
    let now = date.getTimeStamp();
    let orderId = ctx.request.body.orderId || 0;
    let remark = ctx.request.body.remark || '';

    assert.notStrictEqual(orderId, 0, '入参不正确！');

    ctx.orm().PlayOrderRemark.create({
      orderId,
      remark,
      manageId: ctx.work.managerId,
      manageName: ctx.work.managerRealName,
      createTime: now
    });

    ctx.body = {};
  },
  getOrderRemark: async ctx => {
    let orderId = ctx.request.body.orderId || 0;

    let result = await ctx.orm().PlayOrderRemark.findAll({
      where: {
        orderId
      }
    });

    ctx.body = result;
  },
  sendUserLoginCode: async ctx => {
    let phone = ctx.request.body.phone || '';

    assert.ok(validate.chkFormat(phone, 'phone'), '入参不正确！');

    // 更新未使用的码
    await ctx.orm().PlayUserCode.update(
      {
        isuse: 1
      },
      {
        where: {
          phone,
          isuse: 0
        }
      }
    );

    let now = date.getTimeStamp();
    let code = comm.randNumberCode(6);

    let data = {
      apikey: '87613ed05d729dde0d7a769d939160c5',
      text: `【橙汇玩】您的验证码是${code}。如非本人操作，请忽略本短信`,
      mobile: phone
    };

    let result = await http.post({
      url: 'https://sms.yunpian.com/v2/sms/single_send.json',
      data: qs.stringify(data),
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    });

    result = result && result.data ? result.data : result;

    // 新增新码
    await ctx.orm().PlayUserCode.create({
      phone,
      code,
      isuse: 0,
      reqTxt: JSON.stringify(data),
      rspTxt: JSON.stringify(result),
      createTime: now
    });

    if (result.code === 0 && result.count > 0) {
      // 发送成功
    } else {
      // 发送失败
    }
  },
  userLogin: async ctx => {
    let phone = ctx.request.body.phone || '';
    let code = ctx.request.body.code || '';

    assert.ok(validate.chkFormat(phone, 'phone'), '入参不正确！');
    assert.notStrictEqual(code, '', '入参不正确！');

    let codes = await ctx.orm().PlayUserCode.findOne({
      where: {
        phone,
        code,
        isuse: 0
      }
    });

    assert.ok(codes, '验证码已过期或不正确！');

    // 设置code过期
    ctx.orm().PlayUserCode.update(
      {
        isuse: 1
      },
      {
        where: {
          id: codes.id
        }
      }
    );

    let user = await ctx.orm().PlayUser.findOne({
      where: {
        userPhone: phone,
        isDel: 0
      }
    });

    if (user) {
      ctx.body = {
        userId: user.id,
        userPhone: user.userPhone,
        userPhoneDes: `${user.userPhone.substr(0, 3)}****${user.userPhone.substr(7)}`,
        userName: user.userName,
        userImg: ''
      };
    } else {
      // 注册
      let now = date.getTimeStamp();
      let newUser = await ctx.orm().PlayUser.create({
        userPhone: phone,
        userPwd: '',
        userName: '暂无',
        createTime: now,
        isDel: 0
      });

      ctx.body = {
        userId: newUser.id,
        userPhone: newUser.userPhone,
        userPhoneDes: `${newUser.userPhone.substr(0, 3)}****${newUser.userPhone.substr(7)}`,
        userName: newUser.userName,
        userImg: ''
      };
    }
  }
};
