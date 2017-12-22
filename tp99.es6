"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const File_1 = require("./File");
const g_path = 'C:\\Users\\tankunpeng\\Desktop\\readb\\httplogkh'; //'/tol/htdocs';
const count_site = 'www.tol24.com'; //'study.koolearn.com';
// const g_path = '/tol/htdocs';
// const count_site = 'study.koolearn.com';
var studycount = 0;
let index = 0;
let total = 0;
let dic = new Map();
let timestart;
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        timestart = new Date().getTime();
        console.log(`----------------------开始${timestart}-----------------------`);
        console.time("test");
        let f = new File_1.File();
        let files = yield f.getFiles(g_path);
        total = files.length;
        for (let file of files) {
            f.readByline(file, data, done);
        }
    });
}
function data(line) {
    let data = line.split('\t');
    if (data.length < 15 || !data[10]) {
        return;
    }
    let address = data[10];
    let rtime = parseFloat(data[13]);
    rtime = isNaN(rtime) ? 0 : rtime;
    if (address.indexOf(count_site) > -1) {
        studycount++;
    }
    if (!dic.has(address)) {
        dic.set(address, { site: address, count: 1, time: [rtime] });
    }
    else {
        let value = dic.get(address);
        if (!value) {
            return;
        }
        value.time.push(rtime);
        value.count++
    }
}
function done() {
    if (++index < total) {
        return;
    }
    console.log(`${rightpad(count_site, 25)}\t${leftpad(studycount.toString(), 10)}`);
    let map = getTop10(dic);
    map.forEach(i => {
        console.log(`${rightpad(i.site, 25)}\t${leftpad(i.count.toString(), 10)}\t${xround(!i.avg ? 0 : i.avg, 3)}`);
    //console.log(`${i.site}\t${i.count}\t${!i.avg ? 0 : i.avg}`);
});
    let end = new Date().getTime();
    console.log(`----------------------结束${end}-----------------------`);
    console.log(`----------------------总耗时：${end - timestart} ms---------`);
    console.timeEnd("test");
}
function getTop10(dic) {
    let result = [];
    dic.forEach((v, k) => {
        v.avg = v.time; // v.count;
        v.avg =  getMax(v.time); //getTP99_raw(v.time);
    if (result.length < 12) {
        result.push(v);
        if (result.length == 12) {
            result.sort((a, b) => !a.avg || !b.avg ? 0 : b.avg - a.avg);
        }
    }
    else {
        let index = result.findIndex(i => !i.avg || !v.avg ? false : i.avg < v.avg);
        result[index] = v;
        result.sort((a, b) => !a.avg || !b.avg ? 0 : b.avg - a.avg);
    }
});
    return result;
}

function getMax(times) {
    let time = 0;
    for (let newTime of times) {
        time = time > newTime ? time : newTime;
    }
    return time;
}


function getTP99_raw(times) {
    let time = 0;
    let length = Math.ceil(times.length*0.01);
    let maxTime = [];
    while(length > 0) {
        if(!time) {
            for(let newTime of times) {
                time > newTime ? "" : (time = newTime);
            }
        }
        else {
            for(let newTime of times) {
                (time > newTime || newTime >= maxTime[-1]) ? "" : (time = newTime);
            }
        }
        maxTime.push(time);
        times = times.filter((value) => {
            const result = (value != time);
            if(!result) {
                --length;
            }
            return result;
        });
        if(length > 0) {
            time = 0;
        }
    }
    return time;
}


function xround(x, num) {
    return Math.round(x * Math.pow(10, num)) / Math.pow(10, num);
}
function leftpad(str, len, ch) {
    str = String(str);
    var i = -1;
    if (!ch && ch !== 0)
        ch = ' ';
    len = len - str.length;
    while (++i < len) {
        str = ch + str;
    }
    return str;
}
function rightpad(str, len, ch) {
    str = String(str);
    var i = -1;
    if (!ch && ch !== 0)
        ch = ' ';
    len = len - str.length;
    while (++i < len) {
        str = str + ch;
    }
    return str;
}
test();
//# sourceMappingURL=index.js.map