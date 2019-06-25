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
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('per');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' });
  }else{
      next()
  }
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

