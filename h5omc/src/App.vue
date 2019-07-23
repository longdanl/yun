<template>
	<div id="app" @click="OperatingWebsite()">
		<router-view />
	</div>
</template>

<script>
import {userDetail} from "./api/user"
import { removeToken,getToken } from './utils/auth'
export default {
	name: 'app',
	data () {
		return {
			timer: 0,
		}
	},
	mounted(){
		function checkIE(){
			return '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style
		}
		if (checkIE()) {
			window.addEventListener('hashchange', () => {
				var currentPath = window.location.hash.slice(1);
				if (this.$route.path !== currentPath) {
					this.$router.push(currentPath)
				}
			}, false)
		}
	},
	computed:{
		key(){
			return this.$route.path + Math.random();
		},
	},
	//模块初始化时打开定时器，1小时后刷新token
	created () {
		let refresh_token = JSON.parse(localStorage.getItem('refresh_token'));
		this.timer = setInterval(() => {
			this.$store.dispatch('refresh/refresh', refresh_token)
					.then(() => {
						console.log('刷新成功')
					})
					.catch(() => {
						console.log('刷新失败')
					});
		}, 60*60*1000);
	},

//销毁前清除定时器
	beforeDestroy () {
		clearInterval(this.timer)
	},
	methods: {
		OperatingWebsite() {
			let currentTime = this.currentTime;
			let lastTime = new Date().getTime();
			let timeOut = 30* 60* 1000; //设置时间30分钟
			if (lastTime - currentTime > timeOut) {
				// 30分钟未操作页面，跳转登录页面
				removeToken();
				console.log(getToken());
				this.currentTime = new Date().getTime();
				/*const fullPath = this.$route.fullPath;
				const query = this.$Base64.encode(fullPath);*/
				this.$router.push({
					path: "/login",
					/*query: {
						type: query
					}*/
				});
			} else {
				this.currentTime = new Date().getTime();
			}
		}
	},
}
</script>

<style lang="scss">
body {
	margin: 0px;
	padding: 0px;
	/*background: url(assets/bg1.jpg) center !important;
		background-size: cover;*/
	// background: #1F2D3D;
	font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
	font-size: 14px;
	-webkit-font-smoothing: antialiased;
}

#app {
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
}

.el-submenu [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.el-menu-item [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.toolbar {
	background: #f2f2f2;
	padding: 10px;
	//border:1px solid #dfe6ec;
	margin: 10px 0px;
	.el-form-item {
		margin-bottom: 10px;
	}
}
</style>
