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
    let F = a.toString();
    let newArr = []
    let C;
    let D;
    let E;
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
    if(F.indexOf('alarm:write')!=-1){
        E = "alarm:write"
    }else if(F.indexOf('alarm:read')!=-1){
        E = "alarm:read"
    }else if(F.length==0){
        E = ""
    }
    R.push(C,D,E);
    R.forEach(item => {
        if (item) {
            newArr.push(item);
        }
    });
    newArr.push("self:*");
    return newArr
}
export function getRoleName(a,b,){
    let per = JSON.parse(sessionStorage.getItem('per'));
    per = per.filter(item=>item!="self:*")
    let per1 = per.toString()
    if(per1.indexOf(b)!=-1){
        a = false
    }else if(per1.indexOf("*")!=-1){
       a = false
    }else{
       a = true
    }
    return a
}
export function handleFullScreen(a){
    let element = document.documentElement;
    if (a) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    } else {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            // IE11
            element.msRequestFullscreen();
        }
    }
}
export function excelStyle({rowIndex, columnIndex,a}){
    console.log(a)
    if(rowIndex%a==0&&columnIndex!=a){
        return{
            'background':'#ffffff','color':'#000000','padding':'0','border-right':'1px dashed #c7c7c7'
        }
    }else if(rowIndex%a!=0&&columnIndex!=a){
        return{
            'background':'#f5f8fa','color':'#000000','padding':'0','border-right':'1px dashed #c7c7c7'
        }
    }else{
        return{
            'background':'#fff','color':'#000000','padding':'0'
        }
    }
}