/*
 * @Author: Lienren
 * @Date: 2021-09-04 22:52:54
 * @LastEditTime: 2023-04-21 11:49:58
 * @LastEditors: Lienren
 * @Description: 
 * @FilePath: /node-templete/src/controllers/wms/rearend.js
 * PRESENTED BY ROOT Tech R&D TEAM 2021-2026.
 */
'use strict';

const assert = require('assert');
const sequelize = require('sequelize');
const date = require('../../utils/date');

module.exports = {
  getPros: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 20;
    let { pro_name, sort_first, sort_second, pro_code, pro_brand, pro_unit, pro_supplier } = ctx.request.body;

    let where = { is_del: 0 };
    Object.assign(where, pro_name && { pro_name: { $like: `%${pro_name}%` } })
    Object.assign(where, sort_first && { sort_first: sort_first })
    Object.assign(where, sort_second && { sort_second: sort_second })
    Object.assign(where, pro_code && { pro_code: pro_code })
    Object.assign(where, pro_brand && { pro_brand: pro_brand })
    Object.assign(where, pro_unit && { pro_unit: pro_unit })
    Object.assign(where, pro_supplier && { pro_supplier: { $like: `%${pro_supplier}%` } })

    let result = await ctx.orm().info_pro.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['id', 'desc']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    }
  },
  getProWareHouses: async ctx => {
    let { id } = ctx.request.body;

    assert.ok(!!id, '请选择商品')

    let where = {
      pro_num: {
        $gt: 0
      }
    };
    Object.assign(where, id && { pro_id: id })

    let result = await ctx.orm().info_warehouse_pro.findAll({
      where,
      order: [
        ['space_id'],
        ['pc_id']
      ]
    });

    ctx.body = result
  },
  searchPros: async ctx => {
    let { keywords, pageSize } = ctx.request.body;

    pageSize = !pageSize ? 10 : pageSize

    let where = { is_del: 0 };
    Object.assign(where, keywords &&
    {
      $or: [
        {
          pro_name:
            { $like: `%${keywords}%` }
        },
        {
          pro_code:
            { $like: `%${keywords}%` }
        }]
    })

    let result = await ctx.orm().info_pro.findAll({
      limit: pageSize,
      where,
      order: [['pro_name']]
    });

    ctx.body = result
  },
  submitPro: async ctx => {
    let { id, pro_name, sort_first, sort_second, pro_code, pro_brand, pro_unit, pro_supplier } = ctx.request.body;

    if (id) {
      await ctx.orm().info_pro.update({
        pro_name, sort_first, sort_second, pro_code, pro_brand, pro_unit, pro_supplier
      }, {
        where: { id }
      })
    } else {
      await ctx.orm().info_pro.create({
        pro_name, sort_first, sort_second, pro_code, pro_brand, pro_unit, pro_supplier, is_del: 0
      })
    }

    ctx.body = {}
  },
  delPro: async ctx => {
    let { id } = ctx.request.body;

    await ctx.orm().info_pro.update({
      is_del: 1
    }, {
      where: { id }
    });

    ctx.body = {}
  },
  getWareHouses: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 20;
    let { wh_name } = ctx.request.body;

    let where = { is_del: 0 };
    Object.assign(where, wh_name && { wh_name: { $like: `%${wh_name}%` } })

    let result = await ctx.orm().info_warehouse.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['id', 'desc']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    }
  },
  submitWareHouse: async ctx => {
    let { id, wh_name } = ctx.request.body;

    if (id) {
      await ctx.orm().info_warehouse.update({
        wh_name
      }, {
        where: { id }
      })

      await ctx.orm().info_space.update({
        wh_name
      }, {
        where: {
          wh_id: id
        }
      })
    } else {
      await ctx.orm().info_warehouse.create({
        wh_name, is_del: 0
      })
    }

    ctx.body = {}
  },
  getSpaces: async ctx => {
    let { wh_id } = ctx.request.body;

    assert.ok(!!wh_id, '请输入仓库信息')

    let where = { is_del: 0 };
    Object.assign(where, wh_id && { wh_id })

    let result = await ctx.orm().info_space.findAll({
      where
    });

    ctx.body = result
  },
  getPurchases: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 20;
    let { pc_code, pc_uname, pc_utime, pc_plan_arrival, pc_status } = ctx.request.body;

    let where = { is_del: 0 };
    Object.assign(where, pc_code && { pc_code })
    Object.assign(where, pc_uname && { pc_uname })
    Object.assign(where, pc_utime && { pc_utime: { $between: pc_utime } })
    Object.assign(where, pc_plan_arrival && { pc_plan_arrival: { $between: pc_plan_arrival } })
    Object.assign(where, pc_status && { pc_status })

    let result = await ctx.orm().info_purchase.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['id', 'desc']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    }
  },
  submitPurchase: async ctx => {
    let { id, pc_code, pc_desc, pc_uname, pc_utime, pc_plan_arrival, pc_pros } = ctx.request.body;

    assert.ok(!!pc_code, '请填写采购单编码')
    assert.ok(!!pc_pros, '请填写采购商品信息')
    assert.ok(pc_pros.length > 0, '请填写采购商品信息')

    let pc_status = '未下单'
    let pc_pro_num = pc_pros.length
    let pc_pro_total_num = pc_pros.reduce((pre, curr, index) => {
      pre += curr.pro_num
      return pre
    }, 0)
    let pc_pro_total_price = pc_pros.reduce((pre, curr, index) => {
      pre += Math.floor(curr.pro_num * curr.pro_pc_price * 100) / 100
      return pre
    }, 0)

    let pc = null
    if (id) {
      await ctx.orm().info_purchase.update({
        pc_code, pc_desc, pc_uname, pc_utime, pc_plan_arrival, pc_status,
        pc_pro_num: pc_pro_num,
        pc_pro_total_num: pc_pro_total_num,
        pc_pro_total_price: pc_pro_total_price,
        pc_pro_arrival_num: 0,
        is_del: 0
      }, {
        where: { id, is_del: 0 }
      })

      await ctx.orm().info_purchase_pro.destroy({
        where: {
          pc_id: id
        }
      })

      pc = await ctx.orm().info_purchase.findOne({
        where: {
          id, is_del: 0
        }
      })
    } else {
      pc = await ctx.orm().info_purchase.create({
        pc_code, pc_desc, pc_uname, pc_utime, pc_plan_arrival, pc_status,
        pc_pro_num: pc_pro_num,
        pc_pro_total_num: pc_pro_total_num,
        pc_pro_total_price: pc_pro_total_price,
        pc_pro_arrival_num: 0,
        pc_status_time: date.formatDate(),
        is_del: 0
      })
    }

    if (pc && pc.id) {
      let data = pc_pros.map(m => {
        return {
          ...m,
          pc_id: pc.id,
          pc_code: pc.pc_code,
          pro_pc_total_price: Math.floor(m.pro_num * m.pro_pc_price * 100) / 100,
          pro_arrival_num: 0
        }
      })

      await ctx.orm().info_purchase_pro.bulkCreate(data);
    }

    ctx.body = {}
  },
  submitPurchaseStatus: async ctx => {
    let { id, pc_status } = ctx.request.body;

    assert.ok(!!id, '请选择采购单')
    assert.ok(!!pc_status, '请选择采购单状态')

    await ctx.orm().info_purchase.update({
      pc_status,
      pc_status_time: date.formatDate()
    }, {
      where: {
        id: id,
        is_del: 0
      }
    })

    ctx.body = {}
  },
  delPurchase: async ctx => {
    let { id } = ctx.request.body;

    await ctx.orm().info_purchase.update({
      is_del: 1
    }, {
      where: { id }
    });

    ctx.body = {}
  },
  getPurchasePros: async ctx => {
    let { pc_id } = ctx.request.body;

    assert.ok(!!pc_id, '请选择采购单')

    let where = {};
    Object.assign(where, pc_id && { pc_id })

    let result = await ctx.orm().info_purchase_pro.findAll({
      where
    });

    ctx.body = result
  },
  getArrivals: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 20;
    let { al_code, al_status } = ctx.request.body;

    let where = { is_del: 0 };
    Object.assign(where, al_code && { al_code })
    Object.assign(where, al_status && { al_status })

    let result = await ctx.orm().info_arrival.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['id', 'desc']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    }
  },
  submitPurchaseArrival: async ctx => {
    let { id, pc_id, pc_code, al_code, al_desc, al_uname, pc_pros } = ctx.request.body;

    assert.ok(!!id, '请选择采购单')
    assert.ok(!!al_code, '请填写入库单编码')
    assert.ok(!!pc_pros, '请填写采购商品信息')
    assert.ok(pc_pros.length > 0, '请填写采购商品信息')

    let arrival_pros = pc_pros.filter(f => f.arrival_num > 0)
    assert.ok(arrival_pros.length > 0, '请设置商品到货数量')

    let al_status = '未入库'
    let al_pro_total_num = arrival_pros.reduce((pre, curr, index) => {
      pre += curr.arrival_num
      return pre
    }, 0)
    assert.ok(!!al_pro_total_num, '请设置商品到货数量')


    let al = await ctx.orm().info_arrival.create({
      al_code, al_desc, al_uname, al_pro_total_num,
      al_status,
      al_status_time: date.formatDate(),
      pc_id, pc_code,
      is_del: 0
    })


    if (al && al.id) {
      let data = arrival_pros.map(m => {
        return {
          al_id: al.id,
          al_code: al.al_code,
          pro_id: m.pro_id,
          pro_code: m.pro_code,
          pro_name: m.pro_name,
          pro_unit: m.pro_unit,
          pro_num: m.arrival_num,
          pro_arrival_num: 0,
          pro_arrival_detail: '[]'
        }
      })

      await ctx.orm().info_arrival_pro.bulkCreate(data);

      // 更新入库单到货数量
      let pc = await ctx.orm().info_purchase.findOne({
        where: {
          id,
          is_del: 0
        }
      })

      if (pc) {
        let pc_pro_arrival_num = pc.pc_pro_arrival_num + al_pro_total_num
        let pc_status = pc_pro_arrival_num >= pc.pc_pro_total_num ? '全部到货' : '部分到货'
        await ctx.orm().info_purchase.update({
          pc_pro_arrival_num: pc_pro_arrival_num,
          pc_status: pc_status,
          pc_status_time: date.formatDate()
        }, {
          where: {
            id: pc.id
          }
        })

        for (let i = 0, j = arrival_pros.length; i < j; i++) {
          await ctx.orm().info_purchase_pro.update({
            pro_arrival_num: sequelize.literal(` pro_arrival_num + ${arrival_pros[i].arrival_num} `)
          }, {
            where: {
              id: arrival_pros[i].id,
              pc_id: pc.id
            }
          })
        }
      }
    }

    ctx.body = {}
  },
  delArrival: async ctx => {
    let { id } = ctx.request.body;

    await ctx.orm().info_arrival.update({
      is_del: 1
    }, {
      where: { id }
    });

    ctx.body = {}
  },
  getArrivalPros: async ctx => {
    let { al_id } = ctx.request.body;

    assert.ok(!!al_id, '请选择入库单')

    let where = {};
    Object.assign(where, al_id && { al_id })

    let result = await ctx.orm().info_arrival_pro.findAll({
      where
    });

    ctx.body = result
  },
  searchSpaces: async ctx => {
    let { keywords, pageSize } = ctx.request.body;

    pageSize = !pageSize ? 10 : pageSize

    let where = { is_del: 0 };
    Object.assign(where, keywords &&
    {
      space_name: { $like: `%${keywords}%` }
    })

    let result = await ctx.orm().info_space.findAll({
      limit: pageSize,
      where,
      order: [['space_name']]
    });

    ctx.body = result
  },
  submitArrivalSpace: async ctx => {
    let { al_id, pro_id, space_id, arrival_num } = ctx.request.body;

    assert.ok(!!arrival_num, '请填写入库数量')

    let al = await ctx.orm().info_arrival.findOne({
      where: {
        id: al_id,
        is_del: 0
      }
    })
    assert.ok(!!al, '请选择入库单')

    let al_pro = await ctx.orm().info_arrival_pro.findOne({
      where: {
        al_id: al.id,
        pro_id: pro_id
      }
    })
    assert.ok(!!pro_id, '请选择入库商品')

    let space = await ctx.orm().info_space.findOne({
      where: {
        id: space_id,
        is_del: 0
      }
    })
    assert.ok(!!space_id, '请选择入库货位')

    let wh_pro = await ctx.orm().info_warehouse_pro.findOne({
      where: {
        pro_id: al_pro.pro_id,
        space_id: space.id,
        pc_id: al.pc_id
      }
    })

    if (wh_pro) {
      await ctx.orm().info_warehouse_pro.update({
        pro_num: sequelize.literal(` pro_num + ${arrival_num} `)
      }, {
        where: {
          id: wh_pro.id
        }
      })
    } else {
      await ctx.orm().info_warehouse_pro.create({
        pro_id: al_pro.pro_id,
        pro_code: al_pro.pro_code,
        pro_name: al_pro.pro_name,
        pro_unit: al_pro.pro_unit,
        pro_num: arrival_num,
        space_id: space.id,
        wh_id: space.wh_id,
        wh_name: space.wh_name,
        area_name: space.area_name,
        shelf_name: space.shelf_name,
        space_name: space.space_name,
        pc_id: al.pc_id,
        pc_code: al.pc_code,
        pre_pro_num: 0
      })
    }

    // 设置入库单入库数量
    let pro_arrival_detail = JSON.parse(al_pro.pro_arrival_detail)
    pro_arrival_detail.push({
      pro_num: arrival_num,
      space_id: space.id,
      wh_id: space.wh_id,
      wh_name: space.wh_name,
      area_name: space.area_name,
      shelf_name: space.shelf_name,
      space_name: space.space_name
    })
    await ctx.orm().info_arrival_pro.update({
      pro_arrival_num: sequelize.literal(` pro_arrival_num + ${arrival_num} `),
      pro_arrival_detail: JSON.stringify(pro_arrival_detail)
    }, {
      where: {
        id: al_pro.id
      }
    })

    // 更新入库单状态
    let al_status = '部分入库'
    let al_pros = await ctx.orm().info_arrival_pro.findAll({
      where: {
        al_id: al.id,
        pro_num: {
          $ne: sequelize.literal(` pro_arrival_num `)
        }
      }
    })
    if (al_pros && al_pros.length > 0) {
      al_status = '部分入库'
    } else {
      al_status = '全部入库'
    }
    await ctx.orm().info_arrival.update({
      al_status: al_status,
      al_status_time: date.formatDate()
    }, {
      where: {
        id: al.id,
        is_del: 0
      }
    })

    ctx.body = {}
  },
};