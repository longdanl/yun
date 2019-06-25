import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '../store'
import { getToken } from '../utils/auth'
var urlStr = window.location.href; //获取访问地址
var urlArr = urlStr.split(":8080"); //截取字符串，存到数组中
var urlArrPrev = urlArr[0]; // 获取.com之前的字符串
var weburl = urlArrPrev.toString() + ":8080"; //拼接接口地址
const service = axios.create({
  //TODO：以后这里需要做多环境处理
  baseURL: weburl,
  withCredentials: true,
  timeout: 5*60*1000
});
// request interceptor
service.interceptors.request.use(
  config => {
  if (getToken()) {
      config.headers.Authorization = `Bearer ${getToken()}`
  }
return config
},
  error => {
    console.log(error)
    return Promise.reject(error)
  }
);
service.interceptors.response.use(

  response => {
    const res = response.data;

    console.log(res);
   // console.log(res.access_token)
    //一般接口返回的通过的code为0：
    if (res.code !== 0 &&res.access_token==="" ) {
      Message({
        message:  res.description,
        type: 'error',
        duration: 5*60*1000
      });
      return Promise.reject(res.message || 'error')
    } else if(res.code===2007){
        Message({
            message: "登录失效，请重新登录！",
            type: 'error',
        });
        setTimeout(function(){
            top.location.href ='/login';
        },500)
    }else{
        return res
    }
  },
  error => {
    console.log('err' + error);
    Message({
      message: "系统繁忙，请稍后再试！",
      type: 'error',
    });
      setTimeout(function(){
          top.location.href ='/login';
      },500);
    return Promise.reject(error)
  }
);
export default service
