/*
 * @Author: Lienren
 * @Date: 2020-04-29 18:25:38
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-06-10 22:42:29
 */
'use strict';

const assert = require('assert');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const encrypt = require('../../utils/encrypt');
const cp = require('./checkParam');

const enumHouseStatusName = {
  0: '待审核',
  1: '已通过',
  2: '已上线',
  3: '已下线',
};
const enumHouseSecondTypeName = {
  1: '普通房源',
  2: '精选房源',
};
const enumHouseSecondVerifyName = {
  1: '未审核',
  2: '已审核',
};
const enumHouseSecondStatusName = {
  1: '已下线',
  2: '已上线',
};

module.exports = {
  getRecommHouse: async (ctx) => {
    let result = await ctx.orm('youhouse').yh_house.findAll({
      where: {
        isRecomm: 1,
        status: 2,
        isDel: 0,
      },
      order: [['addTime', 'desc']],
    });

    let houseItems = [];
    if (result) {
      houseItems = result.map((m) => {
        let data = m.dataValues;
        let jians =
          data.jians && data.jians.length > 0 ? JSON.parse(data.jians) : [];
        return {
          ...data,
          yj: data.yj && data.yj.length > 0 ? JSON.parse(data.yj) : ['无'],
          jians: jians.map((jm) => {
            return `root://assets/img/icons/${jm}.png`;
          }),
          jiansKeys: jians,
          stopTime: date.formatDate(data.stopTime, 'YYYY年MM月DD日'),
        };
      });
    }

    ctx.body = houseItems;
  },
  getHouse: async (ctx) => {
    let result = await ctx.orm('youhouse').yh_house.findAll({
      where: {
        status: 2,
        isDel: 0,
      },
      order: [['addTime', 'desc']],
    });

    let houseItems = [];
    if (result) {
      houseItems = result.map((m) => {
        let data = m.dataValues;
        return {
          ...data,
          yj: data.yj && data.yj.length > 0 ? JSON.parse(data.yj) : ['无'],
          jians:
            data.jians && data.jians.length > 0 ? JSON.parse(data.jians) : [],
          stopTime: date.formatDate(data.stopTime, 'YYYY年MM月DD日'),
        };
      });
    }

    ctx.body = houseItems;
  },
  deleteHouse: async (ctx) => {
    let id = ctx.request.body.id || 0;

    cp.isNumberGreaterThan0(id);

    await ctx.orm('youhouse').yh_house.update(
      {
        isDel: 1,
      },
      {
        where: {
          id: id,
          isDel: 0,
        },
      }
    );

    ctx.body = {};
  },
  submitHouse: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let name = ctx.request.body.name || '';
    let imgUrl = ctx.request.body.imgUrl || '';
    let price = ctx.request.body.price || '';
    let yj = ctx.request.body.yj || [];
    let stopTime = ctx.request.body.stopTime || date.formatDate();
    let jians = ctx.request.body.jians || [];
    let address = ctx.request.body.address || '';
    let report = ctx.request.body.report || '';
    let remark = ctx.request.body.remark || '';
    let zcId = ctx.request.body.zcId || 0;
    let zc = ctx.request.body.zc || '';
    let zcName = ctx.request.body.zcName || '';
    let province = ctx.request.body.province || '';
    let city = ctx.request.body.city || '';
    let area = ctx.request.body.area || '';
    let street = ctx.request.body.street || '';
    let isRecomm = ctx.request.body.isRecomm || 0;
    let pmId = ctx.request.body.pmId || 0;
    let pmPhone = ctx.request.body.pmPhone || '';
    let pmName = ctx.request.body.pmName || '';

    cp.isEmpty(name);
    cp.isEmpty(imgUrl);
    cp.isEmpty(price);
    cp.isEmpty(address);
    cp.isEmpty(report);
    cp.isEmpty(remark);
    cp.isNumberGreaterThan0(zcId);
    cp.isEmpty(zc);
    cp.isEmpty(zcName);
    cp.isEmpty(province);
    cp.isEmpty(city);
    cp.isEmpty(area);
    cp.isNumberGreaterThan0(pmId);
    cp.isEmpty(pmPhone);
    cp.isEmpty(pmName);

    if (id > 0) {
      await ctx.orm('youhouse').yh_house.update(
        {
          name: name,
          imgUrl: imgUrl,
          price: price,
          yj: JSON.stringify(yj),
          stopTime: stopTime,
          jians: JSON.stringify(jians),
          address: address,
          report: report,
          remark: remark,
          zcId: zcId,
          zc: zc,
          zcName: zcName,
          province: province,
          city: city,
          area: area,
          street: street,
          isRecomm: isRecomm,
          pmId: pmId,
          pmPhone: pmPhone,
          pmName: pmName,
        },
        {
          where: {
            id: id,
            isDel: 0,
          },
        }
      );

      ctx.body = {
        id: id,
      };
    } else {
      let result = await ctx.orm('youhouse').yh_house.create({
        name: name,
        imgUrl: imgUrl,
        price: price,
        yj: JSON.stringify(yj),
        stopTime: stopTime,
        jians: JSON.stringify(jians),
        address: address,
        report: report,
        remark: remark,
        zcId: zcId,
        zc: zc,
        zcName: zcName,
        status: 2,
        statusName: enumHouseStatusName[2],
        province: province,
        city: city,
        area: area,
        street: street,
        isRecomm: isRecomm,
        addTime: date.formatDate(),
        isDel: 0,
        pmId: pmId,
        pmPhone: pmPhone,
        pmName: pmName,
      });
      ctx.body = {
        id: result.id,
      };
    }
  },
  getHouseSecond: async (ctx) => {
    let hType = ctx.request.body.hType || 0;

    let where = {
      isVerify: 2,
      status: 2,
      isDel: 0,
    };

    if (hType > 0) {
      where.hType = hType;
    }

    let result = await ctx.orm('youhouse').yh_house_second.findAll({
      where: where,
      order: [['addTime', 'desc']],
    });

    let houseItems = [];
    if (result) {
      houseItems = result.map((m) => {
        let data = m.dataValues;
        return {
          ...data,
          imgUrl: JSON.parse(data.imgUrl),
        };
      });
    }

    ctx.body = houseItems;
  },
  submitHouseSecond: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let name = ctx.request.body.name || '';
    let imgUrl = ctx.request.body.imgUrl || [];
    let price = ctx.request.body.price || '';
    let province = ctx.request.body.province || '';
    let city = ctx.request.body.city || '';
    let area = ctx.request.body.area || '';
    let community = ctx.request.body.community || '';
    let acreage = ctx.request.body.acreage || '';
    let floor = ctx.request.body.floor || '';
    let isLift = ctx.request.body.isLift || '';
    let deco = ctx.request.body.deco || '';
    let remark = ctx.request.body.remark || '';
    let userId = ctx.request.body.userId || 0;
    let userPhone = ctx.request.body.userPhone || '';
    let userToken = ctx.request.body.userToken || '';
    let status = ctx.request.body.status || 1;

    cp.isEmpty(name);
    cp.isArrayLengthGreaterThan0(imgUrl);
    cp.isEmpty(price);
    cp.isEmpty(province);
    cp.isEmpty(city);
    cp.isEmpty(area);
    cp.isEmpty(community);
    cp.isEmpty(acreage);
    cp.isEmpty(floor);
    cp.isEmpty(isLift);
    cp.isEmpty(deco);
    cp.isNumberGreaterThan0(userId);
    cp.isEmpty(userPhone);
    cp.isEmpty(userToken);
    cp.isNumberGreaterThan0(status);

    let user = await ctx.orm('youhouse').yh_users.findOne({
      where: {
        id: userId,
        isDel: 0,
      },
    });
    assert.ok(user !== null, '您的帐号不存在！');
    assert.ok(user.userStatus === 1, '您的帐号被停用，请联系管理员！');
    assert.ok(
      user.userToken === userToken,
      '您的帐号已在别处登录，请退出后重新登录！'
    );

    if (id > 0) {
      await ctx.orm('youhouse').yh_house_second.update(
        {
          name: name,
          imgUrl: JSON.stringify(imgUrl),
          price: price,
          province: province,
          city: city,
          area: area,
          community: community,
          acreage: acreage,
          floor: floor,
          isLift: isLift,
          deco: deco,
          remark: remark,
          uPhone: userPhone,
          status: status,
          statusName: enumHouseSecondStatusName[status],
          isVerify: 1,
          isVerifyName: enumHouseSecondVerifyName[1],
        },
        {
          where: {
            id: id,
            uId: user.id,
            isDel: 0,
          },
        }
      );

      ctx.body = {
        id: id,
      };
    } else {
      let result = await ctx.orm('youhouse').yh_house_second.create({
        name: name,
        imgUrl: JSON.stringify(imgUrl),
        price: price,
        province: province,
        city: city,
        area: area,
        community: community,
        acreage: acreage,
        floor: floor,
        isLift: isLift,
        deco: deco,
        remark: remark,
        uId: user.id,
        uName: user.userName,
        uPhone: userPhone,
        uCompName: user.userCompName,
        status: status,
        statusName: enumHouseSecondStatusName[status],
        hType: 1,
        hTypeName: enumHouseSecondTypeName[1],
        addTime: date.formatDate(),
        isDel: 0,
        isVerify: 1,
        isVerifyName: enumHouseSecondVerifyName[1],
      });

      ctx.body = {
        id: result.id,
      };
    }
  },
  getUserHouseSecond: async (ctx) => {
    let userId = ctx.request.body.userId || 0;
    let userToken = ctx.request.body.userToken || '';

    cp.isNumberGreaterThan0(userId);
    cp.isEmpty(userToken);

    let user = await ctx.orm('youhouse').yh_users.findOne({
      where: {
        id: userId,
        isDel: 0,
      },
    });
    assert.ok(user !== null, '您的帐号不存在！');
    assert.ok(user.userStatus === 1, '您的帐号被停用，请联系管理员！');
    assert.ok(
      user.userToken === userToken,
      '您的帐号已在别处登录，请退出后重新登录！'
    );

    let result = await ctx.orm('youhouse').yh_house_second.findAll({
      where: {
        uId: user.id,
        isDel: 0,
      },
      order: [['addTime', 'desc']],
    });

    let houseItems = [];
    if (result) {
      houseItems = result.map((m) => {
        let data = m.dataValues;
        return {
          ...data,
          imgUrl: JSON.parse(data.imgUrl),
        };
      });
    }

    ctx.body = houseItems;
  },
  deleteHoueSecond: async (ctx) => {
    let id = ctx.request.body.name || 0;
    let userId = ctx.request.body.userId || 0;
    let userToken = ctx.request.body.userToken || '';

    cp.isNumberGreaterThan0(id);
    cp.isNumberGreaterThan0(userId);
    cp.isEmpty(userToken);

    let user = await ctx.orm('youhouse').yh_users.findOne({
      where: {
        id: userId,
        isDel: 0,
      },
    });
    assert.ok(user !== null, '您的帐号不存在！');
    assert.ok(user.userStatus === 1, '您的帐号被停用，请联系管理员！');
    assert.ok(
      user.userToken === userToken,
      '您的帐号已在别处登录，请退出后重新登录！'
    );

    await ctx.orm('youhouse').yh_house_second.update(
      {
        isDel: 1,
      },
      {
        where: {
          id: id,
          uId: user.id,
          isDel: 0,
        },
      }
    );

    ctx.body = {};
  },
  editHouseSecondStatus: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let userId = ctx.request.body.userId || 0;
    let userToken = ctx.request.body.userToken || '';
    let status = ctx.request.body.status || 1;

    cp.isNumberGreaterThan0(id);
    cp.isNumberGreaterThan0(userId);
    cp.isEmpty(userToken);
    cp.isNumberGreaterThan0(status);

    let user = await ctx.orm('youhouse').yh_users.findOne({
      where: {
        id: userId,
        isDel: 0,
      },
    });
    assert.ok(user !== null, '您的帐号不存在！');
    assert.ok(user.userStatus === 1, '您的帐号被停用，请联系管理员！');
    assert.ok(
      user.userToken === userToken,
      '您的帐号已在别处登录，请退出后重新登录！'
    );

    await ctx.orm('youhouse').yh_house_second.update(
      {
        status: status,
        statusName: enumHouseSecondStatusName[status],
      },
      {
        where: {
          id: id,
          uId: user.id,
          isDel: 0,
        },
      }
    );

    ctx.body = {};
  },
};
