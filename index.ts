import { File } from './File';



const g_path = 'C:\\Users\\tankunpeng\\Desktop\\readb\\httplogkh'; //'/tol/htdocs';
const count_site = 'www.tol24.com';//'study.koolearn.com';

// const g_path = '/tol/htdocs';
// const count_site = 'study.koolearn.com';

var studycount = 0;
let index = 0;
let total = 0;
let dic = new Map<string, { site: string, count: number, time: number }>();
let timestart: number;

async function test() {

    timestart = new Date().getTime();
    console.log(`----------------------开始${timestart}-----------------------`);
    console.time("test");

    let f = new File();
    let files = await f.getFiles(g_path);

    total = files.length;


    for (let file of files) {
        f.readByline(file, data, done);
    }
}

function data(line: string) {
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
        dic.set(address, { site: address, count: 1, time: rtime });
    } else {
        let value = dic.get(address);
        if (!value) {
            return;
        }

        value.count++;
        value.time += rtime;
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
    console.log(`----------------------总耗时：${end - timestart} ms---------`)
    console.timeEnd("test");
}

function getTop10(dic: Map<string, { site: string, count: number, time: number, avg?: number }>) {
    let result: { site: string, count: number, time: number, avg?: number }[] = [];
    dic.forEach((v, k) => {
        v.avg = v.time / v.count;
        if (result.length < 10) {
            result.push(v);
            if (result.length == 10) {
                result.sort((a, b) => !a.avg || !b.avg ? 0 : a.avg - b.avg)
            }

        } else {
            let index = result.findIndex(i => !i.avg || !v.avg ? false : i.avg < v.avg);
            result[index] = v;
            result.sort((a, b) => !a.avg || !b.avg ? 0 : a.avg - b.avg);
        }
    });

    return result;
}

function xround(x: number, num: number) {
    return Math.round(x * Math.pow(10, num)) / Math.pow(10, num);
}

function leftpad(str: string, len: number, ch?: string | number) {
    str = String(str);

    var i = -1;

    if (!ch && ch !== 0) ch = ' ';

    len = len - str.length;

    while (++i < len) {
        str = ch + str;
    }

    return str;
}

function rightpad(str: string, len: number, ch?: string | number) {
    str = String(str);

    var i = -1;

    if (!ch && ch !== 0) ch = ' ';

    len = len - str.length;

    while (++i < len) {
        str = str + ch;
    }

    return str;
}

test();
