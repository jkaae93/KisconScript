// ==UserScript==
// @name         get kiscon - machin
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
    console.log('start script');
    setClickEvent();
    getNameList();
    clickSimpleInfo();
    setTimeout(function() {
        console.log('stopped timeout');
        errHandle();
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
        var length = localStorage.length;
        var expect = Number($('.active').text()) * 5;
        console.log('current length: ' + (length + 1) + ' except: ' + expect);

        console.log('name ' + companyName);
//        var index = $('#strItem').text().split("]").indexOf("[철근ㆍ콘크리트공사업");
        var index = $('#strItem').text().split("]").indexOf("[기계설비공사업");
        var state = $('#strItem').text().split("]")[index+2].replace('[','');
        localStorage.setItem(length, JSON.stringify({"상호" : companyName, "대표자" : ceoName, "전화번호" : tel, "업종상태" : type, "주소" : addr}));

        $('.modal_close')[2].click();
        putList.push(companyName);
        if(length + 1 == expect) {
            $('.btn_prevNext').find('a')[1].click();
        } else {
            console.info('wait next');
        }
    });
}

function saveRequest() {
    var size = Number($('.org01.dml').text().replace(',',''));
    console.log("size: " + size + " current: " + localStorage.length);
    if(localStorage.length >= size-1) {
        if($('.btn_prevNext').find('a')[1].getAttribute("style") != null) { // next page check
            console.log("last page");
            if(window.confirm("Script is done. Do you want download list?")){
                downloadCsv();
            } else {
                console.log("download cancled");
            }
        }
    } else {
        var expect = Number($('.active').text()) * 5;
        if(localStorage.length == expect) {
            console.log("go to nextpage");
            $('.btn_prevNext').find('a')[1].click();
        } else {
            console.warn('please check localStorage. current data is ' + localStorage.length + ' expect data is ' + expect);
        }
    };
}

function downloadCsv(data) {
    var lineArray = [];
    lineArray.push("상호, 대표자, 전화번호, 업종상태, 주소");
    for (let index = 0; index < localStorage.length; index++) {
        var element = JSON.parse(localStorage.getItem(index));
        lineArray.push(buildData(element));
    }
    var csvContent = lineArray.join("\n");
    var pom = document.createElement('a');
    var blob = new Blob(["\ufeff"+csvContent], {type:'text/csv;charset=utf-8'});
    var url = URL.createObjectURL(blob);
    pom.href = url;
    pom.setAttribute('download', 'kiscon_list.csv');
    pom.click();
}

function clickSimpleInfo() {
    $('a.btn-in.btncol_yo').each(function(index) {
        $(this).click();
    });
}

function errHandle() {
    var expect = Number($('.active').text()) * 5;
    if(localStorage.length != expect) {
        console.warn('Check localStorage. current is ' + localStorage.length + ' expect is ' + expect);
        nameList.forEach(function(value, index) {
            if(value != putList[index]) {
                console.log(value);
                var length = localStorage.length;
                var companyName = value;
                var ceoName = ceoList[index];
                console.log('error company name ' + companyName + ' ceo: ' + ceoName);
                localStorage.setItem(length, JSON.stringify({"상호" : companyName, "대표자" : ceoName}));
            }
        });
    } else {
        console.log('all data is done move to nextPage');
    }
    saveRequest();
}

function buildData(value) {
    return value.상호 + ', ' + value.대표자 + ', ' + value.전화번호 + ', ' + value.업종상태 + ', ' + value.주소;
}