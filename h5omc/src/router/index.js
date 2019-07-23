import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Main from '../views/nav3/Main.vue'
import Login from '../views/Login.vue'
import NotFound from '../views/404.vue'
import Home from '../views/Home.vue'
import Table from '../views/nav1/Table.vue'
import Alarm from '../views/nav2/Alarm.vue'
import Journal from '../views/nav2/Journal.vue'
import Role from '../views/nav1/Role.vue'
import Echarts from '../views/charts/Echarts.vue'
import Files1 from '../views/files/Files1'
import PhoneFiles1 from '../views/files/PhoneFiles1'

export const constantRoutes = [
    {
        path: '/login',
        component: resolve => require(["../views/Login"], resolve),
        name: 'Login',
        hidden: true
    },
    {
        path: '/404',
        component: resolve => require(["../views/404"], resolve),
        name: 'NotFond',
        hidden: true
    },
    {
        path: '/',
        component: resolve => require(["../views/Home"], resolve),
        name: '主页',
        iconCls: 'fa fa-home',
        leaf: true,//只有一个节点
        menuShow:true,
        children: [
            { path: '/main', component: resolve => require(["../views/nav3/Main"], resolve), name: '主页',menuShow: true }
        ]
    },
    {
        path: '/',
        component: resolve => require(["../views/Home"], resolve),
        name: '人员管理',
        iconCls: 'fa fa-user-o',//图标样式class
        menuShow:false,
        children: [
            { path: '/table', component: resolve => require(["../views/nav1/Table"], resolve), name: '用户管理',menuShow: true},
            { path: '/role', component: resolve => require(["../views/nav1/Role"], resolve), name: '角色管理',menuShow: true}
        ]
    },
    {
        path: '/',
        component: resolve => require(["../views/Home"], resolve),
        name: '10086彩铃文件管理',
        iconCls:'fa fa-folder-o',//图标样式class
        menuShow:false,
        children: [
            { path: '/files1', component: resolve => require(["../views/files/Files1"], resolve), name: '文件管理',menuShow: true},
            { path: '/phoneFiles1', component: resolve => require(["../views/files/PhoneFiles1"], resolve),  name: '号码绑定',menuShow: true}
        ]
    },
     /* {
          path: '/',
          component: resolve => require(["../views/Home"], resolve),
          name: '告警管理',
          iconCls: 'fa fa-bell-o',
          menuShow: true,
          children: [
              { path: '/alarm', component: resolve => require(["../views/nav2/Alarm"], resolve), name: '当前告警',menuShow: true },
              { path: '/journal', component: resolve => require(["../views/nav2/Journal"], resolve), name: '历史告警',menuShow: true }
          ]
      },*/
    /* {
         path: '/',
         component: Home,
         name: 'Charts',
         iconCls: 'fa fa-bar-chart',
         menuShow: true,
         children: [
           /!*  { path: '/echarts', component: Echarts, name: 'Echarts.vue',menuShow: true },*!/
         ]
     },*/
    {
        path: '*',
        hidden: true,
        redirect: { path: '/login',menuShow: true}
    }
];

const createRouter = () => new Router({
    mode: 'history',//去掉#号
    routes: constantRoutes
});

const router = createRouter();

export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher // reset router
}
export default router
