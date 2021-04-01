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

var nameList = [];
var ceoList = [];
var putList = [];

(function() {
    // main
    $('.paginationz_wrap.visible-xs').empty(); // delete mobile page
    getNameList();
    setClickEvent();
    clickSimpleInfo();
    console.log('start timeout');
    setTimeout(function() {
        console.log('stopped timeout');
        errHandle();
        $('.btn_prevNext').find('a')[1].click();
    },20000);
})();

function getNameList() {
    var list = [];
    $('.basic_tbl.thickgr.w100.mgtp08.flft').find('tr td').each(function(index) {
        $(this).each(function(index) {
            list.push(this.innerText);
        });
    });
    list.forEach(function(value, index) {
        switch(index) {
            case 1: case 10: case 19: case 28: case 37:
                nameList.push(list[index]);
                break;
            case 3: case 12: case 21: case 30: case 39:
                ceoList.push(list[index]);
                break;
        }
    });
    console.log(nameList);
    console.log(ceoList);
}

function setClickEvent() {
    $('#simple_info_c').click(function() {

        var companyName = $('#strSangho').text().replace(/,/g,' ');
        var ceoName = $('#strCeo').text().replace(/,/g,' ');
        var tel = $('#strTel').text().replace(/,/g,' ');
        var addr = $('#strAddr').text().replace(/,/g,' ');
        var type = $('#strItem').text().replace(/,/g,' ');
        var data = localStorage.getItem("0");

        if(data == null) data = [];
        else data = JSON.parse(data);
        console.log('name ' + companyName);
        var index = $('#strItem').text().split("]").indexOf("[철근ㆍ콘크리트공사업");
        var state = $('#strItem').text().split("]")[index+2].replace('[','');
        data.push([companyName,ceoName,tel,addr,state,type]);
        localStorage.setItem("0", JSON.stringify(data));

        $('.modal_close')[2].click();
        putList.push(companyName);
        saveRequest();
    });
}

function saveRequest() {
    var data = localStorage.getItem("0");
    data = JSON.parse(data);
    var size = Number($('.org01.dml').text().replace(',',''));
    console.log("size: " + size + " current: " + data.length);
    if(data.length >= size-1) {
        if($('.btn_prevNext').find('a')[1].getAttribute("style") != null) { // next page check
            console.log("last page");
            if(window.confirm("Script is done. download list?")){
                downloadCsv(data);
            } else {
                console.log("can't download");
            }
        }
    } else {
        var expect = Number($('.active').text()) * 5;
        if(data.length == expect) {
            $('.btn_prevNext').find('a')[1].click();
        } else {
            console.warn('please check data. current data is ' + data.length + ' expect data is ' + expect);
        }
    };
}

function downloadCsv(data) {
    var lineArray = [];
    data.forEach(function (infoArray, index) {
        var line = infoArray.join(",");
        lineArray.push(index == 0 ? "상호, 대표자, 전화번호, 업종상태, 주소\n" + line : line);
    });
    var csvContent = lineArray.join("\n");
    var pom = document.createElement('a');
    var blob = new Blob(["\ufeff"+csvContent], {type:'text/csv;charset=utf-8'});
    var url = URL.createObjectURL(blob);
    pom.href = url;
    pom.setAttribute('download', 'kiscon_list.csv');
    pom.click();
}

function clickSimpleInfo() {
    $('.btn-in.btncol_yo').each(function(index) {
        $(this).click();
    });
}

function errHandle() {
    nameList.forEach(function(value, index) {
        if(value != putList[index]) {
            console.log(value);
            var data = localStorage.getItem('0');
            var companyName = value;
            var ceoName = ceoList[index];
            if(data == null) data = [];
            else data = JSON.parse(data);
            console.log('error company name ' + companyName + ' ceo: ' + ceoName);
            data.push([companyName,ceoName,'','','','']);
            localStorage.setItem('0', JSON.stringify(data));
        }
    });
}
