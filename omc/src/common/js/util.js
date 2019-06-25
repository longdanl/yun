export function formatDate (date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
}

function padLeftZero (str) {
    return ('00' + str).substr(str.length);
}
export function FilesList (data) {
            for (let i = 0; i < data.length; i++) {
                let upload_timestamp = data[i].upload_timestamp;
                let calling_numbers1 = data[i].calling_numbers;
                if (calling_numbers1 == undefined) {
                    calling_numbers1 = ""
                }
                let calling_numbers2 = calling_numbers1 + "";//将对象变为字符串
                calling_numbers2 = calling_numbers2.replace(/\s*/g, "")//去掉所有空格
                data[i].calling_numbers = calling_numbers2;
                upload_timestamp = formatDate(new Date(upload_timestamp), 'yyyy-MM-dd hh:mm:ss');
                data[i].upload_timestamp = upload_timestamp
            }
}
export function callingPhone (data){
    for(let i=0;i<data.length;i++){
        if(data[i].calling_number!=undefined){
            let phone1 = data[i].calling_number+""
            let first = phone1.substring(0,3);
            let second = phone1.substring(3,7);
            let thr = phone1.substring(7,11);
            let phone2 = first+" "+second+" "+thr;
            data[i].calling_number = phone2
        }
    }
}
export function getArray(a){
    let A = a.toString();
    let B = a.toString();
    let newArr = []
    let C;
    let D;
    let R = [];
    if(A.indexOf('user:write')!=-1){
        C = "user:write"
    }else if(A.indexOf('user:read')!=-1){
        C = "user:read"
    }else if(A.length==0){
        C = ""
    }
    if(B.indexOf('crbt_10086:write')!=-1){
        D = "crbt_10086:write"
    }else if(B.indexOf('crbt_10086:read')!=-1){
        D = "crbt_10086:read"
    }else if(B.length==0){
        D = ""
    }
    R.push(C,D);
    R.forEach(item => {
        if (item) {
            newArr.push(item);
        }
    });
    newArr.push("self:*");
    return newArr
}
