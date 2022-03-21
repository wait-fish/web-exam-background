/**文件打包
* arrImages:文件list:[{fileUrl:文件url,renameFileName:文件名}]
* filename 压缩包名
* */
import JSZip from 'jszip';
import FileSaver from 'file-saver';
export default function downloadFiles(arrImages, filename) {

  let zip = new JSZip();
  let cache = {};
  let promises = [];

  for (let item of arrImages) {
    const promise= getImgArrayBuffer(item.fileUrl).then(data => {
    // 下载文件, 并存成ArrayBuffer对象(blob)
    zip.file(item.renameFileName, data, { binary: true }); // 逐个添加文件
    cache[item.renameFileName] = data;
    });
    promises.push(promise);
  }
  Promise.all(promises).then(() => {
    zip.generateAsync({ type: "blob" }).then(content => {
    // 生成二进制流
    FileSaver.saveAs(content, filename + '.zip'); // 利用file-saver保存文件 自定义文件名
    });
  }).catch(res=>{
    alert("下载错误：" + res);
  });
};
//获取文件blob
function getImgArrayBuffer(url) {
  return new Promise((resolve, reject) => {
    //通过请求获取文件blob格式
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.responseType = "blob";
    xmlhttp.onload = function (res) {
    if (res.target.status == 200) {
      resolve(res.target.response);
    }else{
      reject(res.status);
    }
    }
    xmlhttp.send();
  });
};