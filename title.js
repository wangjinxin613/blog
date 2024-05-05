// md 标题自动生成脚本

const path = require('path')
const fs = require('fs');

function traverseFolder(folderPath) {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(folderPath, file);
      fs.stat(filePath, async (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }

        if (stats.isDirectory()) {
          // 文件夹
          traverseFolder(filePath); // 递归调用自身
        } else {
          const createTime = await getFileCreateTime(filePath)

          // 文件
          if (filePath.endsWith('.md')) {
            const data = fs.readFileSync(filePath, 'utf-8').toString();
            if (!data.startsWith(`---`)) {
              const dirList = filePath.split('/');
              insertAtTop(filePath, `---
title: ${file.slice(0, -3)}
date: ${timestampToTime(new Date(createTime).getTime() / 1000)}
tags:
	- ${dirList[dirList.length-2]}
---
`)
            }

          }

        }
      });
    });
  });
}

function insertAtTop(filePath, contentToInsert) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    const newData = contentToInsert + data;
    fs.writeFile(filePath, newData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log('Content inserted successfully.');
      }
    });
  });
}

function getFileCreateTime(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      const { ctime } = stats;
      resolve(ctime)
    });
  })

}

function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}


traverseFolder('/Users/xiaowang/code/mine/wangjinxin613/_posts');