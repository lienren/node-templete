/*
 * @Author: Lienren
 * @Date: 2019-04-02 17:35:45
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-07-09 08:16:43
 */
'use strict';

const assert = require('assert');
const date = require('../../utils/date');

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
      attributes: ['id', 'title', 'price', 'score', 'strokeDay', 'createTime'],
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
      attributes: ['id', 'title', 'price', 'size', 'height', 'peopleNum', 'createTime'],
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
      busUserId
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
        busUserId
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
      attributes: ['id', 'title', 'price', 'clsName', 'strokeDay', 'site', 'createTime'],
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
      busUserId
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
        busUserId
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
      attributes: ['id', 'title', 'price', 'score', 'strokeDay', 'createTime'],
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
      attributes: ['id', 'title', 'price', 'score', 'strokeDay', 'createTime'],
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
  }
};
