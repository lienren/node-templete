/*
 * @Author: Lienren
 * @Date: 2019-10-17 11:28:47
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-11-13 14:17:46
 */
"use strict";

const date = require("../../utils/date");
const cp = require("./checkParam");
const dic = require("./fruitEnum");

module.exports = {
  getAll: async ctx => {
    let param = ctx.request.body || {};
    let pageIndex = param.pageIndex || 1;
    let pageSize = param.pageSize || 20;

    let where = {
      isDel: 0
    };

    if (param.proType && param.proType > 0) {
      where.proType = param.proType;
    }

    if (param.proVerifyType && param.proVerifyType > 0) {
      where.proVerifyType = param.proVerifyType;
    }

    if (param.groupUserId && param.groupUserId > 0) {
      where.groupUserId = param.groupUserId;
    }

    if (param.sortId && param.sortId > 0) {
      where.sortId = param.sortId;
    }

    if (param.isOnline !== undefined && param.isOnline !== null) {
      where.isOnline = param.isOnline;
    }

    let total = await ctx.orm().ftProducts.count({
      where
    });
    let list = await ctx.orm().ftProducts.findAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [["proIndex"]]
    });

    ctx.body = {
      list,
      total,
      pageIndex,
      pageSize
    };
  },
  get: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);

    let result = await ctx.orm().ftProducts.findOne({
      where: {
        id: param.id,
        isDel: 0
      }
    });

    ctx.body = result;
  },
  add: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.proType);
    cp.isEmpty(param.proIndex);
    cp.isEmpty(param.sortId);
    cp.isEmpty(param.sortName);
    cp.isEmpty(param.title);
    cp.isEmpty(param.subTitle);
    cp.isEmpty(param.originalPrice);
    cp.isEmpty(param.sellPrice);
    cp.isEmpty(param.costPrice);
    if (param.isLimit && param.isLimit > 0) {
      cp.isEmpty(param.limitNum);
    }
    cp.isEmpty(param.specInfo);
    cp.isEmpty(param.content);
    cp.isEmpty(param.masterImg);
    cp.isArray(param.subImg);
    cp.isEmpty(param.groupInfo);
    if (param.proType === 1) {
      cp.isEmpty(param.groupUserId);
      cp.isEmpty(param.proVerifyType);
    }

    // 平台商品计算返佣
    if (param.proType === 2) {
      // 如果佣金没有配置，则设置为10%
      if (param.rebateRate === undefined || param.rebateRate === null) {
        param.rebateRate = 10;
      }

      // 计算返佣
      param.rebatePrice = dic.rebateTypeEnum.calc(
        param.rebateType,
        param.sellPrice,
        param.rebateRate,
        param.rebatePrice
      );
    }

    let pro = await ctx.orm().ftProducts.create({
      proType: param.proType,
      proTypeName: dic.proTypeEnum[`${param.proType}`],
      proIndex: param.proIndex,
      sortId: param.sortId,
      sortName: param.sortName,
      title: param.title,
      subTitle: param.subTitle,
      originalPrice: param.originalPrice,
      sellPrice: param.sellPrice,
      costPrice: param.costPrice,
      proProfit: param.sellPrice - param.costPrice,
      isLimit: param.isLimit || 0,
      limitNum: param.limitNum || 0,
      pickTime: param.pickTime || 0,
      specInfo: param.specInfo,
      isOnline: param.isOnline || 0,
      proVerifyType: param.proType === 1 ? param.proVerifyType : 3,
      proVerifyTypeName:
        dic.proVerifyTypeEnum[
          `${param.proType === 1 ? param.proVerifyType : 3}`
        ],
      proVerifyTime: param.proType === 1 ? undefined : date.formatDate(),
      content: param.content,
      stock: param.stock || 0,
      saleNum: 0,
      saleNumV: param.saleNumV || 0,
      masterImg: param.masterImg,
      subImg: JSON.stringify(param.subImg),
      groupUserId: param.groupUserId || 0,
      rebateType: param.proType === 1 ? 0 : param.rebateType || 0,
      rebateTypeName:
        dic.rebateTypeEnum[`${param.proType === 1 ? 0 : param.rebateType}`],
      rebateRate: param.rebateRate || 0,
      rebatePrice: param.rebatePrice || 0,
      isRecommend: param.isRecommend || 0,
      groupInfo: param.groupInfo,
      addTime: date.formatDate(),
      isDel: 0
    });

    if (pro && pro.proVerifyType === 3) {
      let groupInfo =
        pro.groupInfo && pro.groupInfo.length > 0
          ? JSON.parse(pro.groupInfo)
          : {
              gProType: 1,
              startTime: null,
              endTime: null,
              teamNum: 0,
              isRecommend: m.isRecommend
            };

      if (pro.proType === 1) {
        let group = await ctx.orm().ftGroups.findOne({
          where: {
            groupUserId: pro.groupUserId,
            gStatus: 2,
            isDel: 0
          }
        });

        if (group) {
          await ctx.orm().ftGroupProducts.create({
            gId: group.id,
            gProType: groupInfo.gProType,
            gProTypeName: dic.groupProTypeEnum[`${groupInfo.gProType}`],
            proId: pro.id,
            startTime: groupInfo.startTime,
            endTime: groupInfo.endTime,
            teamNum: groupInfo.teamNum || 0,
            isRecommend: groupInfo.isRecommend || 0,
            addTime: date.formatDate(),
            isDel: 0
          });
        }
      } else if (pro.proType === 2) {
        let groups = await ctx.orm().ftGroups.findAll({
          where: {
            gStatus: 2,
            isDel: 0
          }
        });

        let groupPros = groups.map(m => {
          return {
            gId: m.id,
            gProType: groupInfo.gProType,
            gProTypeName: dic.groupProTypeEnum[`${groupInfo.gProType}`],
            proId: pro.id,
            startTime: groupInfo.startTime,
            endTime: groupInfo.endTime,
            teamNum: groupInfo.teamNum || 0,
            isRecommend: groupInfo.isRecommend || 0,
            addTime: date.formatDate(),
            isDel: 0
          };
        });

        // 添加平台商品
        await ctx.orm().ftGroupProducts.bulkCreate(groupPros);
      }
    }
  },
  edit: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);
    cp.isEmpty(param.proType);
    cp.isEmpty(param.proIndex);
    cp.isEmpty(param.sortId);
    cp.isEmpty(param.sortName);
    cp.isEmpty(param.title);
    cp.isEmpty(param.subTitle);
    cp.isEmpty(param.originalPrice);
    cp.isEmpty(param.sellPrice);
    cp.isEmpty(param.costPrice);
    if (param.isLimit && param.isLimit > 0) {
      cp.isEmpty(param.limitNum);
    }
    cp.isEmpty(param.specInfo);
    cp.isEmpty(param.content);
    cp.isEmpty(param.masterImg);
    cp.isArray(param.subImg);
    cp.isEmpty(param.groupInfo);
    if (param.proType === 1) {
      cp.isEmpty(param.groupUserId);
      cp.isEmpty(param.proVerifyType);
    }

    // 平台商品计算返佣
    if (param.proType === 2) {
      cp.isEmpty(param.rebateType);

      // 如果佣金没有配置，则设置为10%
      if (param.rebateRate === undefined || param.rebateRate === null) {
        param.rebateRate = 10;
      }

      // 计算返佣
      param.rebatePrice = dic.rebateTypeEnum.calc(
        param.rebateType,
        param.sellPrice,
        param.rebateRate,
        param.rebatePrice
      );
    }

    let updateProInfo = {
      proType: param.proType,
      proTypeName: dic.proTypeEnum[`${param.proType}`],
      proIndex: param.proIndex,
      sortId: param.sortId,
      sortName: param.sortName,
      title: param.title,
      subTitle: param.subTitle,
      originalPrice: param.originalPrice,
      sellPrice: param.sellPrice,
      costPrice: param.costPrice,
      proProfit: param.sellPrice - param.costPrice,
      isLimit: param.isLimit || 0,
      limitNum: param.limitNum || 0,
      pickTime: param.pickTime || 0,
      specInfo: param.specInfo,
      isOnline: param.isOnline || 0,
      proVerifyType: param.proType === 1 ? param.proVerifyType : 3,
      proVerifyTypeName:
        dic.proVerifyTypeEnum[
          `${param.proType === 1 ? param.proVerifyType : 3}`
        ],
      proVerifyTime: param.proType === 1 ? undefined : date.formatDate(),
      content: param.content,
      stock: param.stock || 0,
      saleNum: 0,
      saleNumV: param.saleNumV || 0,
      masterImg: param.masterImg,
      subImg: JSON.stringify(param.subImg),
      groupUserId: param.groupUserId || 0,
      rebateType: param.proType === 1 ? 0 : param.rebateType,
      rebateTypeName:
        dic.rebateTypeEnum[`${param.proType === 1 ? 0 : param.rebateType}`],
      rebateRate: param.rebateRate || 0,
      rebatePrice: param.rebatePrice || 0,
      isRecommend: param.isRecommend || 0,
      groupInfo: param.groupInfo,
      updateTime: date.formatDate()
    };

    let result = await ctx.orm().ftProducts.update(updateProInfo, {
      where: {
        id: param.id,
        isDel: 0
      }
    });

    if (
      result &&
      result.length > 0 &&
      result[0] > 0 &&
      updateProInfo.proVerifyType === 3
    ) {
      let groupInfo =
        updateProInfo.groupInfo && updateProInfo.groupInfo.length > 0
          ? JSON.parse(updateProInfo.groupInfo)
          : {
              gProType: 1,
              startTime: null,
              endTime: null,
              teamNum: 0,
              isRecommend: m.isRecommend
            };

      await ctx.orm().ftGroupProducts.update(
        {
          gProType: groupInfo.gProType,
          gProTypeName: dic.groupProTypeEnum[`${groupInfo.gProType}`],
          startTime: groupInfo.startTime,
          endTime: groupInfo.endTime,
          teamNum: groupInfo.teamNum || 0,
          isRecommend: groupInfo.isRecommend || 0,
          updateTime: date.formatDate()
        },
        {
          where: {
            proId: param.id,
            isDel: 0
          }
        }
      );
    }
  },
  del: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);

    // 删除商品
    await ctx.orm().ftProducts.update(
      {
        updateTime: date.formatDate(),
        isDel: 1
      },
      {
        where: {
          id: param.id,
          isDel: 0
        }
      }
    );

    // 删除团购商品
    await ctx.orm().ftGroupProducts.update(
      {
        updateTime: date.formatDate(),
        isDel: 1
      },
      {
        where: {
          proId: param.id,
          isDel: 0
        }
      }
    );
    await ctx.orm().ftGroupProductRounds.update(
      {
        updateTime: date.formatDate(),
        isDel: 1
      },
      {
        where: {
          proId: param.id,
          isDel: 0
        }
      }
    );
  },
  verifyPro: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);
    cp.isEmpty(param.proVerifyType);

    let pro = await ctx.orm().ftProducts.findOne({
      where: {
        id: param.id,
        proVerifyType: 2,
        isDel: 0
      }
    });

    if (pro) {
      let result = await ctx.orm().ftProducts.update(
        {
          proVerifyType: param.proVerifyType,
          proVerifyTypeName: dic.proVerifyTypeEnum[`${param.proVerifyType}`],
          proVerifyTime: date.formatDate(),
          updateTime: date.formatDate()
        },
        {
          where: {
            id: pro.id,
            proVerifyType: 2,
            isDel: 0
          }
        }
      );

      if (
        result &&
        result.length > 0 &&
        result[0] > 0 &&
        param.proVerifyType === 3
      ) {
        let groupInfo =
          pro.groupInfo && pro.groupInfo.length > 0
            ? JSON.parse(pro.groupInfo)
            : {
                gProType: 1,
                startTime: null,
                endTime: null,
                teamNum: 0,
                isRecommend: m.isRecommend
              };

        console.log("groupInfo:", groupInfo);

        let group = await ctx.orm().ftGroups.findOne({
          where: {
            groupUserId: pro.groupUserId,
            gStatus: 2,
            isDel: 0
          }
        });

        console.log("group:", group);

        if (group) {
          let groupProduct = await ctx.orm().ftGroupProducts.findOne({
            where: {
              gId: group.id,
              proId: pro.id,
              isDel: 0
            }
          });

          console.log("groupProduct:", groupProduct);

          if (groupProduct) {
            await ctx.orm().ftGroupProducts.update(
              {
                gProType: groupInfo.gProType,
                gProTypeName: dic.groupProTypeEnum[`${groupInfo.gProType}`],
                startTime: groupInfo.startTime,
                endTime: groupInfo.endTime,
                teamNum: groupInfo.teamNum || 0,
                isRecommend: groupInfo.isRecommend || 0,
                updateTime: date.formatDate()
              },
              {
                where: {
                  gId: group.id,
                  proId: pro.id,
                  isDel: 0
                }
              }
            );
          } else {
            await ctx.orm().ftGroupProducts.create({
              gId: group.id,
              gProType: groupInfo.gProType,
              gProTypeName: dic.groupProTypeEnum[`${groupInfo.gProType}`],
              proId: pro.id,
              startTime: groupInfo.startTime,
              endTime: groupInfo.endTime,
              teamNum: groupInfo.teamNum || 0,
              isRecommend: groupInfo.isRecommend || 0,
              addTime: date.formatDate(),
              isDel: 0
            });
          }
        }
      }
    }
  },
  onOffLinePro: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);

    await ctx.orm().ftProducts.update(
      {
        isOnline: param.isOnline || 0,
        updateTime: date.formatDate()
      },
      {
        where: {
          id: param.id,
          isDel: 0
        }
      }
    );
  }
};
