/*
 * @Author: Lienren 
 * @Date: 2021-01-25 00:24:48 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-01-25 09:16:14
 */

const fs = require('fs');
const path = require('path');
const natural = require('natural');

var list = [];

function listFile(dir, dirName, fileNames) {
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
        if (searchValue.indexOf(dirs[i]) >= 0) {
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

      ctx.body = hits;
    } else {
      ctx.body = [];
    }
  },
  scanning: async ctx => {
    let root = '/Users/lienren/Downloads/Compressed/jquery.panzoom-master/demo/docs'

    let items = listFile(root, '', '');
    console.log('items:', items);
    ctx.orm().svg_maps.bulkCreate(items);

    ctx.body = {}
  }
};