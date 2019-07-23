import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'babel-polyfill'
import VueRouter from 'vue-router'
import store from './store'
import Vuex from 'vuex'
import 'font-awesome/css/font-awesome.min.css'
import VideoPlayer from 'vue-video-player'
import App from './App'
import router from './router'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css');

Vue.use(ElementUI);
Vue.use(VideoPlayer)
Vue.use(VueRouter);
Vue.use(Vuex);

router.beforeEach(async(to, from, next) => {
  let per1
  let per
  let per2
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('router');
    per1 = []
    sessionStorage.setItem('per', JSON.stringify(per1));
    per = ""
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path:'/login'});
  }else{
     per1 = JSON.parse(sessionStorage.getItem('per'));
     per = per1.toString();
    for(let i = 0;i<router.options.routes.length;i++){
      if(router.options.routes[i].name=="人员管理"){
        router.options.routes[i].menuShow = false
        }
      for(let j = 0;j<router.options.routes.length;j++) {
        if (router.options.routes[j].name == "10086彩铃文件管理") {
          router.options.routes[j].menuShow = false
        }
       /* for(let k = 0;k<router.options.routes.length;k++) {
          if (router.options.routes[k].name == "告警管理") {
            router.options.routes[k].menuShow = false
          }
        }*/
      }
    }
    if(per1.length>=1){
      for(let k =0;k<per1.length;k++){
        if(per1[k]=="*"){
         per2 = true
        }
      }
      for(let i = 0;i<router.options.routes.length;i++){
        if(per.indexOf('user:read')!=-1||per.indexOf('user:write')!=-1||per2){
          if(router.options.routes[i].name=="人员管理"){
            router.options.routes[i].menuShow = true
          }
        }
      }
      for(let j = 0;j<router.options.routes.length;j++) {
        if (per.indexOf('crbt_10086:read') !=-1 || per.indexOf('crbt_10086:write') != -1||per2) {
          if (router.options.routes[j].name == "10086彩铃文件管理") {
            router.options.routes[j].menuShow = true
          }
        }
      }
      for(let k = 0;k<router.options.routes.length;k++) {
        if (per.indexOf('alarm:read') !=-1 || per.indexOf('alarm:write') != -1||per2) {
          if (router.options.routes[k].name == "告警管理") {
            router.options.routes[k].menuShow = true
          }
        }
      }
      sessionStorage.setItem('router',JSON.stringify(router.options.routes));
      next()
    }else{
      sessionStorage.setItem('router',JSON.stringify(router.options.routes));
      next()
    }
  }
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

