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
import Resource from '../views/nav1/Resource.vue'
import Echarts from '../views/charts/Echarts.vue'
import Files1 from '../views/files/Files1'
import PhoneFiles1 from '../views/files/PhoneFiles1'

let per = JSON.stringify(sessionStorage.getItem('per'));
    per = per.toString();
export const constantRoutes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '主页',
        iconCls: 'fa fa-home',
        leaf: true,//只有一个节点
        menuShow:per.indexOf("self:*")!=-1,
        children: [
            { path: '/main', component: Main, name: '主页',menuShow: true }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '人员管理',
        iconCls: 'fa fa-user',//图标样式class
        menuShow:per.indexOf("user")!=-1,
        children: [
            { path: '/table', component: Table, name: '用户管理',menuShow: true},
            { path: '/role', component: Role, name: '角色管理',menuShow: true},
           /* { path: '/resource', component: Resource, name: '资源管理',menuShow: true},*/
        ]
    },
    {
        path: '/',
        component: Home,
        name: '10086彩铃文件管理',
        iconCls:'fa fa-folder',//图标样式class
        menuShow:per.indexOf("crbt_10086")!=-1,
        children: [
            { path: '/files1', component: Files1, name: '文件管理',menuShow: true},
            { path: '/phoneFiles1', component: PhoneFiles1, name: '号码绑定',menuShow: true},
        ]
    },
  /*  {
        path: '/',
        component: Home,
        name: '告警管理',
        iconCls: 'fa fa-bell',
        menuShow: true,
        children: [
            { path: '/alarm', component: Alarm, name: '告警查看',menuShow: true },
            { path: '/journal', component: Journal, name: '告警日志',menuShow: true },
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
