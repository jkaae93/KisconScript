// ==UserScript==
// @name         get kiscon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.kiscon.net/gongsi/step_custom.asp
// @require http://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://www.google.com/s2/favicons?domain=kiscon.net
// @grant        none
// ==/UserScript==

(function() {
   var indexSize = $('tbody').find('.lnone').length -1;
   $('#simple_info_c').click(function() {
       var companyName = $('#strSangho').text().replace(/,/g,' ');
       var ceoName = $('#strCeo').text().replace(/,/g,' ');
       var tel = $('#strTel').text().replace(/,/g,' ');
       var addr = $('#strAddr').text().replace(/,/g,' ');
       var type = $('#strItem').text().replace(/,/g,' ');
       var data = localStorage.getItem("0");

       if(data == null) data = [];
       else data = JSON.parse(data);
       console.log(data);
       var index = $('#strItem').text().split("]").indexOf("[철근ㆍ콘크리트공사업");
       var state = $('#strItem').text().split("]")[index+2].replace('[','');
       data.push([companyName,ceoName,tel,addr,state,type]);
       localStorage.setItem("0", JSON.stringify(data));
       $('.modal_close')[2].click();
    });


    $('.btn-in.btncol_yo').each(function(index) {
        $(this).click(function() {
            if(indexSize == index) {
                if($('.btn_prevNext').find('a')[1].getAttribute("style") != null) { // next page check
                    console.log("last page");
                    if(window.confirm("Script is done. download list?")){
                        downloadCsv(data);
                    } else {
                        console.log("can't download");
                    }
                } else {
                    $('.btn_prevNext').find('a')[1].click();
                }
            };
        });
        $(this).click();
   });

    function downloadCsv(data) {
        var lineArray = [];
        data.forEach(function (infoArray, index) {
            var line = infoArray.join(",");
            lineArray.push(index == 0 ? "상호, 대표자, 전화번호, 주소, 업종상태\n" + line : line);
        });
        var csvContent = lineArray.join("\n");
        var pom = document.createElement('a');
        var blob = new Blob(["\ufeff"+csvContent], {type:'text/csv;charset=utf-8'});
        var url = URL.createObjectURL(blob);
        pom.href = url;
        pom.setAttribute('download', 'kiscon_list.csv');
        pom.click();
    }
})();
