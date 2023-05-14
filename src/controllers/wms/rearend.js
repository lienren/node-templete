/*
 * @Author: Lienren
 * @Date: 2021-09-04 22:52:54
 * @LastEditTime: 2023-05-14 17:04:59
 * @LastEditors: Lienren
 * @Description: 
 * @FilePath: /node-templete/src/controllers/wms/rearend.js
 * PRESENTED BY ROOT Tech R&D TEAM 2021-2026.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const sequelize = require('sequelize');
const date = require('../../utils/date');
const excel = require('../../utils/excel');

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
  getProSpec: async ctx => {
    let { pro_id } = ctx.request.body;

    let spec = await ctx.orm().info_pro_spec.findOne({
      where: {
        pro_id: pro_id
      }
    })

    ctx.body = !spec ? {
      pro_id,
      spec_num: 0,
      box_long: 0,
      box_width: 0,
      box_height: 0,
      box_weight: 0
    } : spec
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
    let { id, pro_name, sort_first, sort_second, pro_code, pro_brand, pro_unit, pro_supplier, outside_id, spec_info } = ctx.request.body;

    if (id) {
      await ctx.orm().info_pro.update({
        pro_name, sort_first, sort_second, pro_code, pro_brand, pro_unit, pro_supplier, outside_id
      }, {
        where: { id }
      })
    } else {
      let pro = await ctx.orm().info_pro.create({
        pro_name, sort_first, sort_second, pro_code, pro_brand, pro_unit, pro_supplier, outside_id, is_del: 0
      })

      id = pro.id
    }

    if (id && spec_info) {
      let pro_spec = await ctx.orm().info_pro_spec.findOne({
        where: {
          pro_id: id
        }
      })

      if (pro_spec) {
        await ctx.orm().info_pro_spec.update({
          spec_num: spec_info.spec_num,
          box_long: spec_info.box_long,
          box_width: spec_info.box_width,
          box_height: spec_info.box_height,
          box_weight: spec_info.box_weight
        }, {
          where: {
            pro_id: id
          }
        })
      } else {
        await ctx.orm().info_pro_spec.create({
          pro_id: id,
          spec_num: spec_info.spec_num,
          box_long: spec_info.box_long,
          box_width: spec_info.box_width,
          box_height: spec_info.box_height,
          box_weight: spec_info.box_weight
        })
      }
    }

    ctx.body = {}
  },
  uploadPro: async ctx => {
    let { filePath } = ctx.request.body;
    assert.ok(!!filePath, '请选择商品文件')

    let filePathObj = path.parse(filePath)
    let filePhysicalPath = path.resolve(__dirname, `../../../assets/uploads/${filePathObj.base}`)
    let data = excel.readExcel(filePhysicalPath)

    let pros = []
    for (let i = 0, j = data.length; i < j; i++) {
      if (i < 3) {
        continue
      }

      pros.push({
        outside_id: data[i][0],
        pro_name: data[i][4],
        sort_first: data[i][1],
        sort_second: data[i][2],
        pro_code: data[i][3],
        pro_brand: data[i][5],
        pro_unit: data[i][11],
        pro_supplier: data[i][10],
        is_del: 0
      })
    }
    assert.ok(pros.length > 0, '订单文件中没有商品信息')

    for (let i = 0, j = pros.length; i < j; i++) {
      let pro = await ctx.orm().info_pro.findOne({
        where: {
          pro_code: pros[i].pro_code
        }
      })

      if (pro) {
        await ctx.orm().info_pro.update({
          ...pros[i]
        }, {
          where: {
            id: pro.id
          }
        })
      } else {
        await ctx.orm().info_pro.create({
          ...pros[i]
        })
      }
    }

    fs.unlink(filePhysicalPath, () => {
      console.log('商品文件删除成功')
    })

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
  uploadPurchase: async ctx => {
    let { filePath, pc_uname } = ctx.request.body;
    assert.ok(!!filePath, '请选择采购单文件')

    let filePathObj = path.parse(filePath)
    let filePhysicalPath = path.resolve(__dirname, `../../../assets/uploads/${filePathObj.base}`)
    let data = excel.readExcel(filePhysicalPath)

    let pur = {
      pc_code: `CGS${date.formatDate(new Date(), 'YYYYMMDDHHmmss')}`,
      pc_desc: '',
      pc_uname: pc_uname,
      pc_utime: date.formatDate(),
      pc_plan_arrival: date.formatDate(data[1][4], 'YYYY-MM-DD'),
      pc_pro_num: 0,
      pc_pro_total_num: 0,
      pc_pro_total_price: 0,
      pc_pro_arrival_num: 0,
      pc_status: '已采购',
      pc_status_time: date.formatDate(),
      is_del: 0
    }

    let pur_pros = []
    for (let i = 0, j = data.length; i < j; i++) {
      if (i < 4) {
        continue
      }

      let pro = await ctx.orm().info_pro.findOne({
        where: {
          pro_name: data[i][2]
        }
      })

      if (pro) {
        pur_pros.push({
          pc_id: 0,
          pc_code: pur.pc_code,
          pro_id: pro.id,
          pro_code: pro.pro_code,
          pro_name: pro.pro_name,
          pro_unit: pro.pro_unit,
          pro_num: parseInt(data[i][4]),
          pro_pc_price: parseFloat(data[i][5]),
          pro_pc_total_price: Math.floor(parseInt(data[i][4]) * parseFloat(data[i][5]) * 100) / 100,
          pro_arrival_num: 0
        })
      }
    }

    assert.ok(pur_pros.length > 0, '采购单文件中没有商品信息')

    pur.pc_pro_num = pur_pros.length
    pur.pc_pro_total_num = pur_pros.reduce((pre, curr, index) => {
      return pre + curr.pro_num
    }, 0)
    pur.pc_pro_total_price = pur_pros.reduce((pre, curr, index) => {
      return pre + curr.pro_pc_total_price
    }, 0)
    pur = await ctx.orm().info_purchase.create({ ...pur })

    if (pur.id) {
      await ctx.orm().info_purchase_pro.bulkCreate(
        pur_pros.map(m => {
          return {
            ...m,
            pc_id: pur.id
          }
        })
      )
    }

    fs.unlink(filePhysicalPath, () => {
      console.log('采购单文件删除成功')
    })

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

    let where = {}
    Object.assign(where, al_id && { al_id })

    let result = await ctx.orm().info_arrival_pro.findAll({
      where
    });

    ctx.body = result
  },
  getArrivalProsByNoInSpace: async ctx => {
    let where = {
      pro_num: {
        $gt: sequelize.literal(` pro_arrival_num `)
      }
    }

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
    let { al_id, pro_id, space_id, arrival_num, arrival_uname } = ctx.request.body;

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

    let pc_id = al.pc_id
    let pc_code = al.pc_code

    // 如果是退货入库单，则取出库时最早的采购入库批次
    if (al.al_type === '退货入库单') {
      let back_pro = await ctx.orm().info_back_pro.findOne({
        where: {
          pc_id: al_pro.back_id,
          pc_code: al_pro.back_code,
          pro_id: pro_id
        }
      })

      if (back_pro) {
        let order_code = back_pro.order_code
        let out_pro = await ctx.orm().info_outwh_pro.findOne({
          limit: 1,
          where: {
            order_code: order_code,
            pro_code: al_pro.pro_code,
            is_del: 0
          },
          order: [['o_id', 'desc']]
        })

        if (out_pro) {
          let out_pro_space = await ctx.orm().info_outwh_pro_space.findOne({
            limit: 1,
            where: {
              o_id: out_pro.o_id,
              o_code: out_pro.o_code,
              pro_code: al_pro.pro_code
            },
            order: [['id']]
          })

          if (out_pro_space) {
            pc_id = out_pro_space.pc_id
            pc_code = out_pro_space.pc_code
          }
        }
      }
    }

    let wh_pro = await ctx.orm().info_warehouse_pro.findOne({
      where: {
        pro_id: al_pro.pro_id,
        space_id: space.id,
        pc_id: pc_id
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
        pc_id: pc_id,
        pc_code: pc_code,
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
      pro_arrival_detail: JSON.stringify(pro_arrival_detail),
      arrival_uname
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
      al_status_time: date.formatDate(),
      al_arrival_uname: arrival_uname
    }, {
      where: {
        id: al.id,
        is_del: 0
      }
    })

    ctx.body = {}
  },
  getWareHousePros: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 20;
    let { pro_code, pro_name, wh_name, area_name, shelf_name, space_name } = ctx.request.body;

    let where = {
      pro_num: {
        $gt: 0
      }
    };
    Object.assign(where, pro_code && { pro_code: pro_code })
    Object.assign(where, pro_name && { pro_name: { $like: `%${pro_name}%` } })
    Object.assign(where, wh_name && { wh_name: wh_name })
    Object.assign(where, area_name && { area_name: area_name })
    Object.assign(where, shelf_name && { shelf_name: shelf_name })
    Object.assign(where, space_name && { space_name: space_name })

    let result = await ctx.orm().info_warehouse_pro.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['space_id'],
        ['pc_id']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    }
  },
  getOuts: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 20;
    let { o_code, o_status } = ctx.request.body;

    let where = { is_del: 0 };
    Object.assign(where, o_code && { o_code })
    Object.assign(where, o_status && { o_status })

    let result = await ctx.orm().info_outwh.findAndCountAll({
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
  getOutPros: async ctx => {
    let { o_id } = ctx.request.body;

    let where = { is_del: 0 };
    Object.assign(where, o_id && { o_id })

    let result = await ctx.orm().info_outwh_pro.findAll({
      where
    });

    ctx.body = result
  },
  getOutProsByOrderCode: async ctx => {
    let { order_code } = ctx.request.body;

    let where = { is_del: 0 }
    Object.assign(where, order_code && { order_code })

    let result = await ctx.orm().info_outwh_pro.findAll({
      attributes: ['pro_code', 'pro_name', 'pro_num', 'pro_unit'],
      where,
      order: [['pro_code']]
    });

    if (result && result.length > 0) {
      let pros = await ctx.orm().info_pro.findAll({
        where: {
          pro_code: {
            $in: result.map(m => {
              return m.dataValues.pro_code
            })
          }
        }
      })

      if (pros && pros.length > 0) {
        ctx.body = pros.map(m => {
          let f = result.find(f => f.dataValues.pro_code === m.dataValues.pro_code)
          return {
            pro_id: m.dataValues.id,
            pro_code: m.dataValues.pro_code,
            pro_name: m.dataValues.pro_name,
            pro_num: f ? f.pro_num : 0,
            pro_unit: m.dataValues.pro_unit
          }
        })
      } else {
        ctx.body = []
      }
    } else {
      ctx.body = []
    }
  },
  getOutProSpaces: async ctx => {
    let { o_id } = ctx.request.body;

    let where = {};
    Object.assign(where, o_id && { o_id })

    let result = await ctx.orm().info_outwh_pro_space.findAll({
      where
    });

    ctx.body = result
  },
  analyzeOrderByOut: async ctx => {
    let { filePath } = ctx.request.body;
    assert.ok(!!filePath, '请选择订单文件')

    let filePathObj = path.parse(filePath)
    let filePhysicalPath = path.resolve(__dirname, `../../../assets/uploads/${filePathObj.base}`)
    let data = excel.readExcel(filePhysicalPath)

    let orders = []
    for (let i = 0, j = data.length; i < j; i++) {
      if (i === 0 || data[i][0] === '小计:' || data[i][0] === '合计:') {
        continue
      }

      let order_code = data[i][0]

      // 拣货中或已出库订单不进入出库单中
      let sql = `select order_code from info_outwh_pro p 
      inner join info_outwh o on o.id = p.o_id 
      where p.order_code = '${order_code}' and o.o_status in ('拣货中', '已出库') and o.is_del = 0 limit 1`
      let result = await ctx.orm().query(sql)
      if (result && result.length > 0) {
        continue
      }

      orders.push({
        order_code: order_code,
        pro_code: data[i][20],
        pro_name: data[i][21],
        pro_unit: data[i][25],
        pro_num: parseInt(data[i][24]),
        pro_out_status: '库存充足'
      })
    }
    assert.ok(orders.length > 0, '订单文件中没有商品信息或已经下过出库单')

    let wh_pros = await ctx.orm().info_warehouse_pro.findAll({
      where: {
        pro_code: {
          $in: orders.map(m => {
            return m.pro_code
          })
        }
      }
    })

    // 合并库存
    let wh_pro_nums = {}
    wh_pros.map(m => {
      if (wh_pro_nums[m.pro_code]) {
        wh_pro_nums[m.pro_code] += (m.pro_num - m.pre_pro_num)
      } else {
        wh_pro_nums[m.pro_code] = (m.pro_num - m.pre_pro_num)
      }
    })

    // 验证库存是否满足
    orders.map(m => {
      if (wh_pro_nums[m.pro_code]) {
        if (wh_pro_nums[m.pro_code] >= m.pro_num) {
          m.pro_out_status = '库存充足'
          wh_pro_nums[m.pro_code] -= m.pro_num
        } else {
          m.pro_out_status = '库存不足'
        }
      } else {
        m.pro_out_status = '库存中无此商品'
      }
    })

    fs.unlink(filePhysicalPath, () => {
      console.log('订单文件删除成功')
    })

    ctx.body = orders
  },
  submitOut: async ctx => {
    let { o_code, o_orders, o_uname } = ctx.request.body;

    assert.ok(!!o_code, '请填写出库单编码')
    assert.ok(!!o_orders, '请填写出库商品信息')
    assert.ok(o_orders.length > 0, '请填写出库商品信息')

    let orders = o_orders.map(m => m.order_code)
    let orderNews = orders.filter((item, index) => orders.indexOf(item) === index);

    let o_order_num = orderNews.length
    let o_pro_num = o_orders.length

    let outwh = await ctx.orm().info_outwh.create({
      o_code: o_code,
      o_order_num: o_order_num,
      o_pro_num: o_pro_num,
      o_status: '未出库',
      o_status_time: date.formatDate(),
      o_uname,
      is_del: 0
    })

    let info_outwh_pros = o_orders.map(m => {
      return {
        o_id: outwh.id,
        o_code: outwh.o_code,
        order_code: m.order_code,
        pro_code: m.pro_code,
        pro_name: m.pro_name,
        pro_unit: m.pro_unit,
        pro_num: m.pro_num,
        pro_out_status: '异常',
        pro_out_status_time: date.formatDate(),
        pro_out_status_desc: '未检测库存是否充足',
        is_del: 0
      }
    })

    let info_outwh_pro_space = []

    let wh_pros = await ctx.orm().info_warehouse_pro.findAll({
      where: {
        pro_code: {
          $in: info_outwh_pros.map(m => {
            return m.pro_code
          })
        }
      }
    })

    // 合并库存
    let wh_pro_nums = {}
    wh_pros.map(m => {
      if (wh_pro_nums[m.pro_code]) {
        wh_pro_nums[m.pro_code] += (m.pro_num - m.pre_pro_num)
      } else {
        wh_pro_nums[m.pro_code] = (m.pro_num - m.pre_pro_num)
      }
    })

    // 验证库存是否满足
    for (let i = 0, j = info_outwh_pros.length; i < j; i++) {
      let outwh_pro = info_outwh_pros[i]

      let pro = await ctx.orm().info_pro.findOne({
        where: {
          pro_code: outwh_pro.pro_code,
          is_del: 0
        }
      })

      if (!pro) { continue }

      if (wh_pro_nums[outwh_pro.pro_code]) {
        if (wh_pro_nums[outwh_pro.pro_code] >= outwh_pro.pro_num) {
          // 获取库存
          let sql = `select wp.id, wp.space_id, wp.wh_id, wp.wh_name, wp.area_name, wp.shelf_name, wp.space_name, wp.pc_id, wp.pc_code, wp.pro_num, wp.pre_pro_num, s.priority, s.sort_index from info_warehouse_pro wp 
          inner join info_space s on s.id = wp.space_id 
          where wp.pro_id = '${pro.id}' and wp.pro_num - wp.pre_pro_num > 0 
          order by wp.pc_id, s.priority, s.sort_index`
          let result = await ctx.orm().query(sql)

          if (result && result.length > 0) {
            let bck_pro_num = outwh_pro.pro_num

            for (let x = 0, y = result.length; x < y; x++) {
              let surplus_num = (parseInt(result[x].pro_num) - parseInt(result[x].pre_pro_num))

              // 扣库存
              if (surplus_num >= bck_pro_num) {
                // 当前库存够扣
                let update_wh_pro_num = await ctx.orm().info_warehouse_pro.update({
                  pro_num: sequelize.literal(` pro_num - ${bck_pro_num} `)
                }, {
                  where: {
                    id: result[x].id
                  }
                })

                let f = info_outwh_pro_space.find(f => {
                  return f.pro_id === pro.id && f.space_id === result[x].space_id && f.pc_id === result[x].pc_id
                })

                if (f) {
                  f.pro_num += bck_pro_num
                } else {
                  info_outwh_pro_space.push({
                    o_id: outwh_pro.o_id,
                    o_code: outwh_pro.o_code,
                    pro_id: pro.id,
                    pro_code: pro.pro_code,
                    pro_name: pro.pro_name,
                    pro_unit: pro.pro_unit,
                    space_id: result[x].space_id,
                    wh_id: result[x].wh_id,
                    wh_name: result[x].wh_name,
                    area_name: result[x].area_name,
                    shelf_name: result[x].shelf_name,
                    space_name: result[x].space_name,
                    pc_id: result[x].pc_id,
                    pc_code: result[x].pc_code,
                    pro_num: bck_pro_num,
                    sort_index: result[x].sort_index
                  })
                }

                outwh_pro.pro_out_status = '正常'
                outwh_pro.pro_out_status_desc = '库存充足'

                bck_pro_num = 0
                break;
              } else {
                // 当前库存不够扣
                let update_wh_pro_num = await ctx.orm().info_warehouse_pro.update({
                  pro_num: sequelize.literal(` pro_num - ${surplus_num} `)
                }, {
                  where: {
                    id: result[x].id
                  }
                })

                let f = info_outwh_pro_space.find(f => {
                  return f.pro_id === pro.id && f.space_id === result[x].space_id && f.pc_id === result[x].pc_id
                })

                if (f) {
                  f.pro_num += surplus_num
                } else {
                  info_outwh_pro_space.push({
                    o_id: outwh_pro.o_id,
                    o_code: outwh_pro.o_code,
                    pro_id: pro.id,
                    pro_code: pro.pro_code,
                    pro_name: pro.pro_name,
                    pro_unit: pro.pro_unit,
                    space_id: result[x].space_id,
                    wh_id: result[x].wh_id,
                    wh_name: result[x].wh_name,
                    area_name: result[x].area_name,
                    shelf_name: result[x].shelf_name,
                    space_name: result[x].space_name,
                    pc_id: result[x].pc_id,
                    pc_code: result[x].pc_code,
                    pro_num: surplus_num,
                    sort_index: result[x].sort_index
                  })
                }

                bck_pro_num -= surplus_num
              }
            }

          } else {
            outwh_pro.pro_out_status = '异常'
            outwh_pro.pro_out_status_desc = '库存不足'
          }
        } else {
          outwh_pro.pro_out_status = '异常'
          outwh_pro.pro_out_status_desc = '库存不足'
        }
      } else {
        outwh_pro.pro_out_status = '异常'
        outwh_pro.pro_out_status_desc = '仓库中无此商品'
      }
    }

    info_outwh_pro_space.sort((a, b) => {
      return a.sort_index - b.sort_index
    })

    info_outwh_pro_space = info_outwh_pro_space.map(m => {
      return {
        o_id: m.o_id,
        o_code: m.o_code,
        pro_id: m.pro_id,
        pro_code: m.pro_code,
        pro_name: m.pro_name,
        pro_unit: m.pro_unit,
        space_id: m.space_id,
        wh_id: m.wh_id,
        wh_name: m.wh_name,
        area_name: m.area_name,
        shelf_name: m.shelf_name,
        space_name: m.space_name,
        pc_id: m.pc_id,
        pc_code: m.pc_code,
        pro_num: m.pro_num
      }
    })

    // 保存出库单
    await ctx.orm().info_outwh_pro.bulkCreate(info_outwh_pros);
    await ctx.orm().info_outwh_pro_space.bulkCreate(info_outwh_pro_space);

    await ctx.orm().info_outwh.update({
      o_status: '拣货中'
    }, {
      where: {
        id: outwh.id
      }
    })

    ctx.body = {}
  },
  revokeOut: async ctx => {
    let { id } = ctx.request.body;

    let outwh = await ctx.orm().info_outwh.findOne({
      where: {
        id,
        o_status: '拣货中',
        is_del: 0
      }
    })
    assert.ok(!!outwh, '出库单不存在')

    let outwh_pro_spaces = await ctx.orm().info_outwh_pro_space.findAll({
      where: {
        o_id: id
      }
    })
    assert.ok(!!outwh_pro_spaces, '出库单中商品信息不存在')

    for (let i = 0, j = outwh_pro_spaces.length; i < j; i++) {
      let outwh_pro_space = outwh_pro_spaces[i]

      let wh_pro = await ctx.orm().info_warehouse_pro.findOne({
        where: {
          pro_id: outwh_pro_space.pro_id,
          space_id: outwh_pro_space.space_id,
          pc_id: outwh_pro_space.pc_id
        }
      })

      if (wh_pro) {
        await ctx.orm().info_warehouse_pro.update({
          pro_num: sequelize.literal(` pro_num + ${outwh_pro_space.pro_num} `)
        }, {
          where: {
            id: wh_pro.id
          }
        })
      } else {
        await ctx.orm().info_warehouse_pro.create({
          pro_id: outwh_pro_space.pro_id,
          pro_code: outwh_pro_space.pro_code,
          pro_name: outwh_pro_space.pro_name,
          pro_num: outwh_pro_space.pro_num,
          space_id: outwh_pro_space.space_id,
          wh_id: outwh_pro_space.wh_id,
          wh_name: outwh_pro_space.wh_name,
          area_name: outwh_pro_space.area_name,
          shelf_name: outwh_pro_space.shelf_name,
          space_name: outwh_pro_space.space_name,
          pc_id: outwh_pro_space.pc_id,
          pc_code: outwh_pro_space.pc_code,
          pre_pro_num: 0
        })
      }
    }

    await ctx.orm().info_outwh.update({
      o_status: '已撤销'
    }, {
      where: {
        id: outwh.id
      }
    })
  },
  updateOutStatus: async ctx => {
    let { id, o_status } = ctx.request.body;

    assert.ok(!!id, '请选择出库单编号')
    assert.ok(!!o_status, '请选择出库单状态')

    await ctx.orm().info_outwh.update({
      o_status,
      o_status_time: date.formatDate()
    }, {
      where: {
        id,
        is_del: 0
      }
    });

    ctx.body = {}
  },
  delOut: async ctx => {
    let { id } = ctx.request.body;

    await ctx.orm().info_outwh.update({
      is_del: 1
    }, {
      where: { id }
    });

    ctx.body = {}
  },
  transferWareHousePro: async ctx => {
    let { id, new_space_id, transfer_num, uname } = ctx.request.body;

    assert.ok(!!id, '请选择转移老货位')
    assert.ok(!!new_space_id, '请选择转移新货位')
    assert.ok(!!transfer_num, '请输入转移数量')

    let wh_pro = await ctx.orm().info_warehouse_pro.findOne({
      where: {
        id,
        pro_num: {
          $gte: transfer_num
        }
      }
    })
    assert.ok(!!wh_pro, '库存不足或库位上没有此商品')

    let new_space = await ctx.orm().info_space.findOne({
      where: {
        id: new_space_id,
        is_del: 0
      }
    })
    assert.ok(!!new_space, '库位不存在')

    let new_space_pro = await ctx.orm().info_warehouse_pro.findOne({
      where: {
        pro_id: wh_pro.pro_id,
        space_id: new_space.id,
        pc_id: wh_pro.pc_id
      }
    })

    if (new_space_pro) {
      // 商品批次存在，则更新新位置库存
      await ctx.orm().info_warehouse_pro.update({
        pro_num: sequelize.literal(` pro_num + ${transfer_num} `)
      }, {
        where: {
          id: new_space_pro.id
        }
      })
    } else {
      // 商品批次不存在，则新增货位
      await ctx.orm().info_warehouse_pro.create({
        pro_id: wh_pro.pro_id,
        pro_code: wh_pro.pro_code,
        pro_name: wh_pro.pro_name,
        pro_unit: wh_pro.pro_unit,
        pro_num: transfer_num,
        space_id: new_space.id,
        wh_id: new_space.wh_id,
        wh_name: new_space.wh_name,
        area_name: new_space.area_name,
        shelf_name: new_space.shelf_name,
        space_name: new_space.space_name,
        pc_id: wh_pro.pc_id,
        pc_code: wh_pro.pc_code,
        pre_pro_num: 0
      }, {
        where: {
          id: wh_pro.id
        }
      })
    }

    if (wh_pro.pro_num === transfer_num) {
      // 全部转走
      await ctx.orm().info_warehouse_pro.destroy({
        where: {
          id: wh_pro.id
        }
      })
    } else {
      // 转走部分
      await ctx.orm().info_warehouse_pro.update({
        pro_num: sequelize.literal(` pro_num - ${transfer_num} `)
      }, {
        where: {
          id: wh_pro.id
        }
      })
    }

    // 记录转移日志
    await ctx.orm().info_transfer_log.create({
      uname,
      old_wh_pro: JSON.stringify({
        pro_id: wh_pro.pro_id,
        pro_code: wh_pro.pro_code,
        pro_name: wh_pro.pro_name,
        pro_unit: wh_pro.pro_unit,
        pro_num: transfer_num,
        space_id: wh_pro.space_id,
        wh_id: wh_pro.wh_id,
        wh_name: wh_pro.wh_name,
        area_name: wh_pro.area_name,
        shelf_name: wh_pro.shelf_name,
        space_name: wh_pro.space_name,
        pc_id: wh_pro.pc_id,
        pc_code: wh_pro.pc_code,
        pre_pro_num: 0
      }),
      new_wh_pro: JSON.stringify({
        pro_id: wh_pro.pro_id,
        pro_code: wh_pro.pro_code,
        pro_name: wh_pro.pro_name,
        pro_unit: wh_pro.pro_unit,
        pro_num: transfer_num,
        space_id: new_space.id,
        wh_id: new_space.wh_id,
        wh_name: new_space.wh_name,
        area_name: new_space.area_name,
        shelf_name: new_space.shelf_name,
        space_name: new_space.space_name,
        pc_id: wh_pro.pc_id,
        pc_code: wh_pro.pc_code,
        pre_pro_num: 0,
      })
    })
  },
  searchOutOrders: async ctx => {
    let { keywords, pageSize } = ctx.request.body;

    pageSize = !pageSize ? 10 : pageSize

    let where = ` where is_del=0 and order_code like '%${keywords}%' `
    let sql = `select order_code from (select order_code from info_outwh_pro ${where} group by order_code) a limit ${pageSize}`

    let result = await ctx.orm().query(sql);

    ctx.body = result.map(m => {
      return m.order_code
    })
  },
  getBackOrders: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 20;
    let { pc_code, pc_uname, pc_utime, pc_status } = ctx.request.body;

    let where = { is_del: 0 };
    Object.assign(where, pc_code && { pc_code })
    Object.assign(where, pc_uname && { pc_uname })
    Object.assign(where, pc_utime && { pc_utime: { $between: pc_utime } })
    Object.assign(where, pc_status && { pc_status })

    let result = await ctx.orm().info_back.findAndCountAll({
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
  submitBackOrder: async ctx => {
    let { id, pc_code, pc_desc, pc_uname, pc_utime, pc_pros } = ctx.request.body;

    assert.ok(!!pc_code, '请填写退货单编码')
    assert.ok(!!pc_pros, '请填写退货商品信息')
    assert.ok(pc_pros.length > 0, '请填写退货商品信息')

    let pc_status = '退货中'
    let pc_pro_num = pc_pros.length
    let pc_pro_total_num = pc_pros.reduce((pre, curr, index) => {
      pre += curr.pro_back_num
      return pre
    }, 0)

    let pc = null
    if (id) {
      await ctx.orm().info_back.update({
        pc_code, pc_desc, pc_uname, pc_utime, pc_status,
        pc_pro_num: pc_pro_num,
        pc_pro_total_num: pc_pro_total_num,
        pc_pro_arrival_num: 0,
        is_del: 0
      }, {
        where: { id, is_del: 0 }
      })

      await ctx.orm().info_back_pro.destroy({
        where: {
          pc_id: id
        }
      })

      pc = await ctx.orm().info_back.findOne({
        where: {
          id, is_del: 0
        }
      })
    } else {
      pc = await ctx.orm().info_back.create({
        pc_code, pc_desc, pc_uname, pc_utime, pc_status,
        pc_pro_num: pc_pro_num,
        pc_pro_total_num: pc_pro_total_num,
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
          pro_arrival_num: 0
        }
      })

      await ctx.orm().info_back_pro.bulkCreate(data);
    }

    ctx.body = {}
  },
  submitBackOrderStatus: async ctx => {
    let { id, pc_status } = ctx.request.body;

    assert.ok(!!id, '请选择退货单')
    assert.ok(!!pc_status, '请选择退货单状态')

    await ctx.orm().info_back.update({
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
  delBackOrder: async ctx => {
    let { id } = ctx.request.body;

    await ctx.orm().info_back.update({
      is_del: 1
    }, {
      where: { id }
    });

    ctx.body = {}
  },
  getBackOrderPros: async ctx => {
    let { pc_id } = ctx.request.body;

    assert.ok(!!pc_id, '请选择退货单')

    let where = {};
    Object.assign(where, pc_id && { pc_id })

    let result = await ctx.orm().info_back_pro.findAll({
      where
    });

    ctx.body = result
  },
  submitBackOrderArrival: async ctx => {
    let { id, pc_id, pc_code, al_code, al_desc, al_uname, pc_pros } = ctx.request.body;

    assert.ok(!!id, '请选择退货单')
    assert.ok(!!al_code, '请填写入库单编码')
    assert.ok(!!pc_pros, '请填写退货商品信息')
    assert.ok(pc_pros.length > 0, '请填写退货商品信息')

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
      is_del: 0,
      al_type: '退货入库单'
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
          pro_arrival_detail: '[]',
          back_id: pc_id,
          back_code: pc_code,
          back_order_code: m.order_code
        }
      })

      await ctx.orm().info_arrival_pro.bulkCreate(data);

      // 更新入库单到货数量
      let pc = await ctx.orm().info_back.findOne({
        where: {
          id,
          is_del: 0
        }
      })

      if (pc) {
        let pc_pro_arrival_num = pc.pc_pro_arrival_num + al_pro_total_num
        let pc_status = pc_pro_arrival_num >= pc.pc_pro_total_num ? '全部到货' : '部分到货'
        await ctx.orm().info_back.update({
          pc_pro_arrival_num: pc_pro_arrival_num,
          pc_status: pc_status,
          pc_status_time: date.formatDate()
        }, {
          where: {
            id: pc.id
          }
        })

        for (let i = 0, j = arrival_pros.length; i < j; i++) {
          await ctx.orm().info_back_pro.update({
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
};