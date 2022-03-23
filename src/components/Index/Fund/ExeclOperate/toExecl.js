var idTmr;
//自己定义一个函数transform，在里面写我们的业务逻辑
function transform(table, name, callback) {  //table为表格数据,name为导出文件名,
                        //callback为导出完毕回调,方便你知道导出完成了(可根据自己需求决定是否需要)
  let tableInnerHTML = ''
  let headerData = ['报名人数','报名费（元/人）','报名总金额（元）','考务费（元/人）','考务费总金额（元）','费用清单', "老师名单"]
  let bodyData = table      //这里对应是表格数据，我们只需要传过来即可
    //拼接完全使用thead、tbody、tr、td、th，并且相应的tr、th、td里可以写一些类似colspan(决定占几列)
    //rowspan(决定占几行)的属性、可以用作合并行、合并列等高级操作
    tableInnerHTML += '<thead><tr>';    //头部部分开始拼接！
    tableInnerHTML += `<th colspan=${headerData.length} 
    				style='border:1px solid #444;'>` + `日期${table[0].order_id.split('|')[0]}——${table[0].order_id.split('|')[1]}` + "</th></tr>"
    tableInnerHTML += '<tr>'  
    headerData.forEach(item => {           
            tableInnerHTML += "<th rowspan='1' style='border:1px solid #444;'>"
            			  + item + "</th>"
        })
   tableInnerHTML += '</tr></thead>';     //头部部分结束
    tableInnerHTML += '<tbody>'           //身体部分开始
    bodyData.forEach(item => {                      
    tableInnerHTML += "<tr>"
      tableInnerHTML += "<td>" + item.students + "</td>"
      tableInnerHTML += "<td>" + item.student_registration_fee + "</td>"
      tableInnerHTML += "<td>" + item.registration_fee_total + "</td>"
      tableInnerHTML += "<td>" + item.teacher_fee + "</td>"
      tableInnerHTML += "<td>" + item.exam_fee_total + "</td>"
      tableInnerHTML += "<td>" + "<table><tr><th>用途</th><th>金额（元）</th></tr>"
      item.other_fee.forEach(item1 => {
        tableInnerHTML += `<tr><td>${item1.name}</td>
                          <td>${item1.fee}</td></tr>` 
      })
      tableInnerHTML += `</table></td>`
      tableInnerHTML += "<td>" + "<table><tr><th align=''>姓名</th><th>金额（元）</th><th>负责教室</th></tr>"
      item.teacher_info_list.forEach(item1 => {
        tableInnerHTML += `<tr><td>${item1.name}</td>
                          <td>${item1.fee}</td>
                          <td>${item1.classroom}</td></tr>` 
      })
      tableInnerHTML += `</table></td>`
    tableInnerHTML += "</tr>"
    })
        tableInnerHTML += '</tbody>';    //身体结束
//------------OK，到此为止拼接工作做完，也就是基本的数据已经被拼接成表格了--------------------
//tip开始(下面还有个tip结束的位置)
/*-------从tip开始到tip结束的过程是判断浏览器类型步骤，做兼容性处理！对于你来说你完全可以不用
		 深入理解这里面的逻辑，直接复制到自己的项目里去，不会存在任何浏览器兼容性的问题！*/
    function getExplorer() {
      var explorer = window.navigator.userAgent;
      if (explorer.indexOf('MSIE') >= 0) {
          return 'ie';        // ie
      } else if (explorer.indexOf('Firefox') >= 0) {
          return 'Firefox';   // firefox
      } else if (explorer.indexOf('Chrome') >= 0) {
          return 'Chrome';    // Chrome
      } else if (explorer.indexOf('Opera') >= 0) {
          return 'Opera';     // Opera
      } else if (explorer.indexOf('Safari') >= 0) {
          return 'Safari';    // Safari
      };
    };

    if (getExplorer() !== 'Safari' && name.substr(-1, 4) !== '.xls') {
        name += '.xls';
    }
    if (getExplorer() === 'ie') {
        var curTbl = table;
        var oXL = new ActiveXObject('Excel.Application');
        var oWB = oXL.Workbooks.Add();
        var xlsheet = oWB.Worksheets(1);
        var sel = document.body.createTextRange();
        sel.moveToElementText(curTbl);
        sel.select();
        sel.execCommand('Copy');
        xlsheet.Paste();
        oXL.Visible = true;
        try {
          var fname=oXL.Application.GetSaveAsFilename('Excel.xls', 'Excel Spreadsheets (*.xls), *.xls');
        } catch (e) {
            print('Nested catch caught ' + e);
        } finally {
            oWB.SaveAs(fname);
            // oWB.Close(savechanges = false);
            oXL.Quit();
            oXL = null;
            idTmr = setInterval(Cleanup(), 1);
        }
    } else {
        tableToExcel(tableInnerHTML, name, callback);   /*在这调用下面的一个方法，传入拼接完成
                                        	  的表格，文件名，回调函数。该方法是干嘛的请往下看*/
    }
 //tip结束
}   //此括号结束，我们自己封装的transform方法也结束了！90%的逻辑完成了！

/*下面的两个函数对于你来说你也完全不用深入理解里面的逻辑，你只要知道，他是在帮助你做转换，帮助你
  将拼接好的HTML字符串模板真正地转换并且输出到Excel里面去，直接当成固定书写方法，直接拿来用即可*/
function Cleanup() {
    window.clearInterval(idTmr);
}
let tableToExcel = (function () {
    let template = '<html><head><meta charset="UTF-8"><style>th,td{font-family: "宋体";font-size: 16px;border:1px solid #444; text-align: center; }</style></head><body style="font-family: "宋体""><table style="border-collapse: collapse;border-spacing: 0;">{table}</table></body></html>';
    let format = function (s, c) {
        return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; });
    };
    return function (table, name, callback) {
        let ctx = { worksheet: name || 'Worksheet', table: table };
        let blob = new Blob([format(template, ctx)]);
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;     //这里这个name就是对应的文件名！
        a.click();
        a.remove();
        callback('success');    /*这里调用我们自己传入的回调方法，这样导出Excel完成后你就能
        						 在外面知道导出完毕，并且再往下做自己其他的逻辑*/
    };
})();
export default transform;    //导出自己封装的transform方法
