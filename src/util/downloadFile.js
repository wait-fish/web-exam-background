// 下载文件
export default function(href, name) {
  var x = new XMLHttpRequest();
  x.open("GET", href, true);
  x.responseType = 'blob';
  x.onload = function(e) {
      var url = window.URL.createObjectURL(x.response);
      var a = document.createElement('a');
      a.href = url;
      a.download = name + '.' + href.split('.')[1];
      a.click();
  }
  x.send();
}