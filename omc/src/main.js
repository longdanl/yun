import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'babel-polyfill'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import store from './store'
import Vuex from 'vuex'
import router from './router'
import 'font-awesome/css/font-awesome.min.css'
import vueztree from 'vue-ztree-2.0/dist/vue-ztree-2.0.umd.min.js'
import 'vue-ztree-2.0/dist/vue-ztree-2.0.css'

import VideoPlayer from 'vue-video-player'
import {getToken} from "./utils/auth";
import {userDetail} from "./api/user"
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css');

Vue.use(VideoPlayer)

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(vueztree);

router.beforeEach(async(to, from, next) => {
  let per1
  let per
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('refresh_token');
    per1 = []
    sessionStorage.setItem('per', JSON.stringify(per1));
    per = ""
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' });
  }else{
     per1 = JSON.parse(sessionStorage.getItem('per'));
     per = per1.toString();
    console.log(router.options.routes);
    for(let i = 0;i<router.options.routes.length;i++){
      if(router.options.routes[i].name=="人员管理"){
        router.options.routes[i].menuShow = false
        }
      for(let j = 0;j<router.options.routes.length;j++) {
        if (router.options.routes[j].name == "10086彩铃文件管理") {
          router.options.routes[j].menuShow = false
        }
      }
    }
    if(per1.length>1){
      for(let i = 0;i<router.options.routes.length;i++){
        if(per.indexOf('user:read')!=-1||per.indexOf('user:write')!=-1){
          if(router.options.routes[i].name=="人员管理"){
            router.options.routes[i].menuShow = true
          }
        }
      }
      for(let j = 0;j<router.options.routes.length;j++) {
        if (per.indexOf('crbt_10086:read') != -1 || per.indexOf('crbt_10086:write') != -1) {
          if (router.options.routes[j].name == "10086彩铃文件管理") {
            router.options.routes[j].menuShow = true
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

