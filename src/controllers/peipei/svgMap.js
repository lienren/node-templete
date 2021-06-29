/*
 * @Author: Lienren 
 * @Date: 2021-01-25 00:24:48 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-06-29 08:02:09
 */

const fs = require('fs');
const path = require('path');
const natural = require('natural');
const date = require('../../utils/date');

var list = [];

function listFile (dir, dirName, fileNames) {
  let arr = fs.readdirSync(dir);

  arr.forEach(function (item) {
    let fullpath = path.join(dir, item);
    let stats = fs.statSync(fullpath);

    if (stats.isDirectory()) {
      listFile(fullpath, item, fileNames);
    } else {
      if (fileNames.indexOf(item.split('.')[0]) < 1) {
        list.push({
          dir: dirName,
          svg: item.split('.')[0],
          xml: item.split('.')[0],
          is_del: 0
        });
        fileNames += item;
      }
    }
  });

  return list;
}


module.exports = {
  search: async ctx => {
    let searchValue = ctx.request.body.searchValue || '';

    if (ctx.work.managerId) {
      ctx.orm().SuperManagerOpLogs.create({
        manageId: ctx.work.managerId,
        manageName: ctx.work.managerRealName,
        opTitle: '查询SVG单线图',
        opContext: `查询内容【${searchValue}】`
      })
    }

    if (searchValue) {
      let svgs = await ctx.orm().svg_maps.findAll({
        where: {
          is_del: 0
        }
      });

      svgs = svgs.map(m => {
        return {
          ...m.dataValues
        }
      });

      svgs = svgs.reduce((total, current) => {
        if (total[current.dir]) {
          total[current.dir].push({
            id: current.id,
            dir: current.dir,
            svg: current.svg,
            xml: current.xml
          })
        } else {
          total[current.dir] = [];
          total[current.dir].push({
            id: current.id,
            dir: current.dir,
            svg: current.svg,
            xml: current.xml
          })
        }

        return total;
      }, {});

      let hits = [];
      let hotHists = [];
      let dirs = Object.keys(svgs);

      for (let i = 0, j = dirs.length; i < j; i++) {
        if (searchValue.indexOf(dirs[i]) >= 0 && searchValue !== dirs[i]) {
          for (let x = 0, y = svgs[dirs[i]].length; x < y; x++) {
            if (searchValue.indexOf(svgs[dirs[i]][x].svg) >= 0) {
              hits.unshift({
                ...svgs[dirs[i]][x],
                title: svgs[dirs[i]][x].dir + '/' + svgs[dirs[i]][x].svg
              })
              break;
            } else if (natural.JaroWinklerDistance(searchValue, svgs[dirs[i]][x].svg) >= 0.45) {
              hotHists.push({
                ...svgs[dirs[i]][x],
                title: svgs[dirs[i]][x].dir + '/' + svgs[dirs[i]][x].svg,
                hot: natural.JaroWinklerDistance(searchValue, svgs[dirs[i]][x].svg)
              })
            }
          }
          break;
        } else if (dirs[i].indexOf(searchValue) >= 0) {
          for (let x = 0, y = svgs[dirs[i]].length; x < y; x++) {
            hits.unshift({
              ...svgs[dirs[i]][x],
              title: svgs[dirs[i]][x].dir + '/' + svgs[dirs[i]][x].svg
            })
          }
          break;
        } else {
          // 如果找不到，则通过关键字找地图
          for (let x = 0, y = svgs[dirs[i]].length; x < y; x++) {
            if (svgs[dirs[i]][x].svg.indexOf(searchValue) >= 0) {
              hits.unshift({
                ...svgs[dirs[i]][x],
                title: svgs[dirs[i]][x].dir + '/' + svgs[dirs[i]][x].svg
              })
            }
          }
        }
      }

      if (hotHists.length > 0) {
        hotHists = hotHists.sort((a, b) => {
          return b.hot - a.hot
        })
        hotHists.map(m => {
          hits.push({
            ...m
          })
        })
      }

      ctx.orm().svg_search.create({
        search_value: searchValue,
        manage_name: ctx.work.managerRealName,
      });

      ctx.body = hits;
    } else {
      ctx.body = [];
    }
  },
  searchHistory: async ctx => {
    let managerRealName = ctx.work.managerRealName;

    if (ctx.work.managerId) {
      ctx.orm().SuperManagerOpLogs.create({
        manageId: ctx.work.managerId,
        manageName: ctx.work.managerRealName,
        opTitle: '查询历史',
        opContext: `查询SVG单线图历史内容`
      })
    }

    let result = await ctx.orm().svg_search.findAll({
      group: 'search_value',
      where: {
        manage_name: managerRealName
      },
      order: [
        ['id', 'desc']
      ],
      limit: 20
    })

    ctx.body = result.map(m => {
      return {
        search_value: m.dataValues.search_value
      }
    });
  },
  scanning: async ctx => {
    let root = '/Users/lienren/Downloads/Compressed/jquery.panzoom-master/demo/docs'

    let items = listFile(root, '', '');
    console.log('items:', items);
    ctx.orm().svg_maps.bulkCreate(items);

    ctx.body = {}
  },
  searchGps: async ctx => {
    let searchValue = ctx.request.body.searchValue || '';

    if (ctx.work.managerId) {
      ctx.orm().SuperManagerOpLogs.create({
        manageId: ctx.work.managerId,
        manageName: ctx.work.managerRealName,
        opTitle: '查询低压驻点列表',
        opContext: `查询内容【${searchValue}】`
      })
    }

    let where = {};
    if (searchValue) {
      where.title = {
        $like: `%${searchValue}%`
      }
    }

    let result = await ctx.orm().gps_maps.findAll({
      where
    });

    ctx.body = result;
  },
  getGps: async ctx => {
    let id = ctx.request.body.id || 0;

    let result = await ctx.orm().gps_maps.findOne({
      where: {
        id
      }
    });

    if (ctx.work.managerId && result) {
      ctx.orm().SuperManagerOpLogs.create({
        manageId: ctx.work.managerId,
        manageName: ctx.work.managerRealName,
        opTitle: '获取低压驻点',
        opContext: `驻点名称【${result.title}】`
      })
    }

    ctx.body = result;
  },
  editGps: async ctx => {
    let id = ctx.request.body.id || 0;
    let title = ctx.request.body.title || '';
    let a1 = ctx.request.body.a1 || '';
    let a2 = ctx.request.body.a2 || '';
    let a3 = ctx.request.body.a3 || '';
    let a4 = ctx.request.body.a4 || '';
    let a5 = ctx.request.body.a5 || '';
    let a6 = ctx.request.body.a6 || '';
    let a7 = ctx.request.body.a7 || '';
    let latitude = ctx.request.body.latitude || '';
    let longitude = ctx.request.body.longitude || '';

    if (ctx.work.managerId) {
      ctx.orm().SuperManagerOpLogs.create({
        manageId: ctx.work.managerId,
        manageName: ctx.work.managerRealName,
        opTitle: '编辑低压驻点',
        opContext: `驻点编号【${id}】`
      })
    }

    await ctx.orm().gps_maps.update({
      title,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      latitude,
      longitude
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
  getCheckPerson: async ctx => {
    let id = ctx.request.body.id || 0;

    let admin = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        id
      }
    });

    ctx.body = {
      isCheckPerson: admin.isCheckPerson > 0
    }
  },
  getGPSAssessList: async ctx => {
    let gpsMapId = ctx.request.body.gpsMapId || 0;

    if (ctx.work.managerId) {
      ctx.orm().SuperManagerOpLogs.create({
        manageId: ctx.work.managerId,
        manageName: ctx.work.managerRealName,
        opTitle: '获取低压驻点评估列表',
        opContext: `获取低压驻点评估列表，编号【${gpsMapId}】`
      })
    }

    let gpsMapAssessList = await ctx.orm().gps_map_assess.findAll({
      where: {
        gps_map_id: gpsMapId
      },
      order: [['assess_time', 'desc']]
    });

    ctx.body = gpsMapAssessList.map(m => {
      return {
        ...m.dataValues,
        assessTime: date.formatDate(m.dataValues.assess_time, 'YYYY年MM月DD日'),
        assessContext: m.dataValues.assess_context.split(',')
      }
    })
  },
  createGPSAssess: async ctx => {
    let gpsMapId = ctx.request.body.gpsMapId || 0;
    let adminId = ctx.request.body.adminId || 0;
    let assessContext = ctx.request.body.assessContext || [];

    if (ctx.work.managerId) {
      ctx.orm().SuperManagerOpLogs.create({
        manageId: ctx.work.managerId,
        manageName: ctx.work.managerRealName,
        opTitle: '新增低压驻点评估结果',
        opContext: `新增低压驻点评估结果，管理员编号【${adminId}】，驻点编号【${gpsMapId}】`
      })
    }

    let admin = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        id: adminId,
        isDel: 0
      }
    })

    if (admin && assessContext.length > 0) {
      let assessSum = assessContext.reduce((total, current) => {
        total += parseInt(current);
        return total;
      }, 0)

      await ctx.orm().gps_map_assess.create({
        gps_map_id: gpsMapId,
        admin_id: admin.id,
        admin_name: admin.realName,
        assess_context: assessContext.map(m => {
          return m
        }).join(','),
        assess_sum: assessSum
      });
    }

    ctx.body = {};
  }
};