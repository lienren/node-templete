/*
 * @Author: Lienren 
 * @Date: 2018-08-16 10:39:38 
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-08-17 10:24:04
 */
'use strict';

const busbody = require('await-busboy');
const fs = require('fs');
const path = require('path');
const sysPath = process.cwd(); // 系统根目录
const staticPath = path.join(sysPath, 'upload'); // 文件物理存储目录
const virtualPath = '/upload'; // 文件访问虚拟目录
const actions = {
  uploadimage: 'image',
  uploadfile: 'file',
  uploadvideo: 'video',
  listimage: 'image'
};

// 递归创建目录
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

// 获取文件名和存储地址
function getFileName(saveType, originalFileExtName, rootPath, virtualPath) {
  let filePath = path.join(rootPath, saveType, `${new Date().getFullYear()}`, `${new Date().getMonth()}`);
  mkdirsSync(filePath); // 创建文件目录
  let fileName = `${new Date().getTime().toString()}${originalFileExtName}`;
  let fileNamePath = path.join(filePath, fileName);
  virtualPath = `${virtualPath}${fileNamePath.substr(rootPath.length)}`;
  return {
    fileName,
    fileNamePath,
    filePath,
    virtualPath
  };
}

// 递归获取目录下文件
function fileDisplay(dirPath, virtualPaths, rootPath, virtualPath) {
  if (!fs.existsSync(dirPath)) {
    return virtualPaths;
  }

  let dirs = fs.readdirSync(dirPath);

  for (let i = 0, j = dirs.length; i < j; i++) {
    let fileNamePath = path.join(dirPath, dirs[i]);
    let stats = fs.statSync(fileNamePath);

    if (stats.isFile()) {
      virtualPaths.push({
        url: `${virtualPath}${fileNamePath.substr(rootPath.length)}`
      });
    }

    if (stats.isDirectory()) {
      virtualPaths = fileDisplay(fileNamePath, virtualPaths, rootPath, virtualPath);
    }
  }

  return virtualPaths;
}

class KoaUEditor {
  constructor(ctx, next, option) {
    this.ctx = ctx;
    this.next = next;
    this.config = {
      staticPath,
      virtualPath,
      ...option
    };
    this.rootPath = path.join(sysPath, this.config.staticPath);
  }

  async save() {
    let $self = this;
    let action = $self.ctx.query.action || '';

    switch (action) {
      case 'uploadimage':
      case 'uploadfile':
      case 'uploadvideo':
        let parses = busbody($self.ctx);
        let part;
        let originalFileName = '';
        let originalFileExtName = '';
        let fileName = '';
        let virtualPath = '';
        while ((part = await parses)) {
          if (!Array.isArray(part)) {
            originalFileName = part.filename;
            originalFileExtName = path.extname(originalFileName);
            let result = getFileName(actions[action], originalFileExtName, $self.rootPath, $self.config.virtualPath);
            fileName = result.fileName;
            virtualPath = result.virtualPath;

            let stream = fs.createWriteStream(result.fileNamePath);
            part.pipe(stream);
          }
        }

        $self.ctx.body = {
          url: virtualPath,
          title: fileName,
          original: originalFileName,
          state: 'SUCCESS'
        };
        break;
      default:
        $self.ctx.body = {
          state: 'FAIL'
        };
        break;
    }
  }
  async list() {
    let $self = this;
    let action = $self.ctx.query.action || '';

    if (action !== 'listimage') {
      $self.ctx.body = {
        state: 'FAIL'
      };
      return;
    }

    let virtualPaths = fileDisplay(this.rootPath, [], this.rootPath, $self.config.virtualPath);

    $self.ctx.body = {
      state: 'SUCCESS',
      list: virtualPaths,
      start: 0,
      total: virtualPaths.length
    };
  }
}
module.exports = KoaUEditor;
