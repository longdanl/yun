<template>
	<el-row class="container">
		<!--头部-->
		<el-col :span="24" class="topbar-wrap">
			<div class="topbar-logo">
				<a :class="collapsed?'':'show'" style="padding-left:8px;"></a>
			</div>
			<div class="topbar-logos" v-show="!collapsed">
				<a>{{collapsed?'':sysName}}</a>
			</div>
			<div class="topbar-title">
				<!--展开折叠开关-->
				<div @click.prevent="collapse">
					<i class="fa fa-bars" aria-hidden="true" v-show="!collapsed"></i>
					<i class="fa fa-bars" aria-hidden="true" v-show="collapsed"></i>
				</div>
			</div>
			<div class="topbar-account topbar-btn">
				<!--<i class="fa fa-envelope" aria-hidden="true" style="font-size: 24px;color: white;margin-right: 10px"><el-badge is-dot class="item"></el-badge></i>-->
				<el-dropdown trigger="click">
					<el-dropdown trigger="hover">
						<span class="el-dropdown-link userinfo-inner"><img src="../assets/user.png" />{{username}}</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item @click.native="setting" style="font-size: 15px;text-align: center">设置</el-dropdown-item>
							<el-dropdown-item @click.native="updatePass" style="font-size: 15px;text-align: center" divided>修改密码</el-dropdown-item>
							<el-dropdown-item @click.native="logout" style="font-size: 15px;text-align: center" divided>退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</el-dropdown>
			</div>
		</el-col>
		<!--中间-->
		<el-col :span="24" class="main">
			<!--左侧导航-->
			<aside :class="{showSidebar:!collapsed}">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" router :collapse="collapsed" unique-opened>
					<template v-for="(item,index) in $router.options.routes" v-if="item.menuShow">
						<el-submenu v-if="!item.leaf" :index="index+''" >
							<template slot="title"><i :class="item.iconCls" style="color:rgb(135,141,153)"></i><span slot="title">{{item.name}}</span></template>
							<el-menu-item v-for="term in item.children" :key="term.path" :index="term.path" v-if="term.menuShow"
										  :class="$route.path==term.path?'is-active':''">
								<i :class="term.iconCls"></i><span slot="title">{{term.name}}</span>
							</el-menu-item>
						</el-submenu>
						<el-menu-item v-else-if="item.leaf&&item.children&&item.children.length" :index="item.children[0].path"
									  :class="$route.path==item.children[0].path?'is-active':''">
							<i :class="item.iconCls" style="color:rgb(135,141,153)"></i><span slot="title">{{item.children[0].name}}</span>
						</el-menu-item>
					</template>
				</el-menu>
			</aside>
			<!--设置界面-->
			<el-dialog title="设置" v-model="userFormVisible" :close-on-click-modal="false">
				<el-form :model="settingForm" label-width="80px" ref="settingForm">
					<el-form-item label="用户名" prop="username">
						<el-input v-model="settingForm.username" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="手机号码">
						<el-input v-model="settingForm.phone"></el-input>
					</el-form-item>
					<el-form-item label="用户邮箱">
						<el-input v-model="settingForm.email"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="userFormVisible = false">取消</el-button>
					<el-button type="primary" @click.native="settingUser">提交</el-button>
				</div>
			</el-dialog>
			<!--修改密码-->
			<el-dialog title="修改密码" v-model="passFormVisible" :close-on-click-modal="false">
				<el-form :model="passForm" label-width="80px" :rules="passFormRules" ref="passForm">
					<el-form-item label="旧密码" prop="old_password">
						<el-input v-model="passForm.old_password" show-password></el-input>
					</el-form-item>
					<el-form-item label="新密码" prop="new_password" >
						<el-input v-model="passForm.new_password" show-password></el-input>
					</el-form-item>
					<el-form-item label="确认密码" prop="new_password2">
						<el-input v-model="passForm.new_password2" show-password></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="passFormVisible = false">取消</el-button>
					<el-button type="primary" @click.native="updatePwd">提交</el-button>
				</div>
			</el-dialog>
			<!--右侧内容区-->
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner" style="float: right">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="slide-fade">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
import {bus} from '../bus.js'
import {updatePwd,settingUser,} from "../api/user"
import { getToken } from '../utils/auth'
import {userDetail} from "../api/user"
export default {
	name: 'home',
	created(){
		bus.$on('setNickName', (text) => {
			this.nickname = text;
		});
		this.userdetail();
		let p =JSON.stringify(sessionStorage.getItem("per"));
	},
	data () {
		return {
			username: '',
			collapsed: false,
			sysName:'后台管理系统',
			userFormVisible: false,//编辑界面是否显示
			editLoading: false,
			editFormRules: {
				username: [
					{required: true, message: '请输入用户名', trigger: 'blur'}
				]
			},
			passFormVisible: false,//编辑界面是否显示
			passLoading: false,
			passFormRules: {
				old_password: [
					{required: true, message: '请输入旧密码', trigger: 'blur'}
				],
				new_password: [
					{required: true, message: '请输入新密码', trigger: 'blur'}
				],
				new_password2: [
					{required: true, message: '确认密码', trigger: 'blur'}
				],
			},
			//编辑界面数据
			settingForm: {
				username: '',
				phone: "",
				email: '',
			},
			passForm: {
				old_password: '',
				new_password :'',
				new_password2:""
			},
		}
	},
	methods: {
		handleSelect(key, keyPath) {
			console.log(this);
			console.log(key,keyPath);
		},
		//折叠导航栏
		collapse: function () {
			this.collapsed = !this.collapsed;
		},
		userdetail(){
			userDetail(getToken()).then((res) => {
				let per = res.permissions;
				sessionStorage.setItem('per', JSON.stringify(per));
				console.log(res)
			})
		},
		setting(){
			this.userFormVisible=true;
			let user = JSON.parse(sessionStorage.getItem('user'));
			this.settingForm.username = user.username;
		},
		settingUser(){
			settingUser(this.settingForm).then((res)=>{
				if(res.code==0){
					this.$message({
						message:"修改成功",
						type:'success'
					});
					this.userFormVisible=false;
					this.username = res.username;
					console.log(res)
					this.$refs['settingForm'].resetFields();
				}else{
					this.$message({
						message:res.description,
						type:'success'
					});
				}
			})
		},
		updatePass(){
			this.passFormVisible=true;
		},
		updatePwd(){
			if(this.passForm.new_password!=this.passForm.new_password2){
				this.$message({
					message:"两次输入密码不一致",
					type:'error'
				});
			}else{
				this.$confirm('确认修改密码吗?', '提示', {
					type: 'warning'
				}).then(() => {
					updatePwd(this.passForm).then((res)=>{
						if(res.code==0){
							this.passFormVisible=false;
							this.$message({
								message:"修改成功",
								type:'success'
							});
							this.passForm = ""
						}else{
							this.passFormVisible=false;
							this.$message({
								message:res.description,
								type:'error'
							});
							this.passForm = ""
						}
					})
				});
			}
		},
		logout(){
			this.$confirm('确认退出吗?', '提示', {
				confirmButtonClass: 'el-button--warning'
			}).then(() => {
				this.$store.dispatch('user/logout')
						.then(() => {
							this.$message({
								message:"退出成功",
								type:'success'
							});
							this.$router.replace("/login");
						})
						.catch((error) => {
							this.loading = false;
							this.$message({
								message:error.description,
								type:'error'
							});
						});
				this.logining = false;
			}).catch(() => {});
		}
	},
	mounted() {
		var user = sessionStorage.getItem('user');
		if (user) {
			user = JSON.parse(user);
			this.username = user.username || '';
			/*this.sysUserAvatar = user.avatar || '';*/
		}
	}
}
</script>
<style scoped lang="scss">
	@import '~scss_vars';
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;

	.topbar-wrap {
		height: 50px;
		line-height: 50px;
		background: #20a0ff;
		padding: 0px;

	.topbar-btn {
		color: #fff;
	}
	.topbar-logo {
		float: left;
		width: 59px;
		line-height: 26px;
	}
	.topbar-logo .show{
		display:block
	}
	.item {
		margin-top:-12px;
		left:-2px;
	}
	.topbar-logos {
		float: left;
		width: 210px;
		line-height: 50px;
		text-align: center;
	}
	.topbar-logos a{
		color:white;
		height:50px;
		line-height: 50px;
		font-size: 22px;
	}
	.topbar-logo img, .topbar-logos img {
		height: 40px;
		margin-top: 5px;
		margin-left: 2px;
	}
	.topbar-title {
		float: left;
		text-align: left;
		width: 210px;
		padding-left: 10px;
		border-left: 1px solid #ffffff;
	}
	.topbar-account {
		float: right;
		padding-right: 12px;
	}
	.topbar-account img {
		width: 40px;
		height: 40px;
		border-radius: 20px;
		margin: 5px 0px 10px 10px;
		float: right;
	}
	.userinfo-inner {
		cursor: pointer;
		color: #fff;
		padding-left: 10px;
	}
	}
	.main {
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		position: absolute;
		top: 50px;
		bottom: 0px;
		overflow: hidden;
	}

	aside {
		min-width: 50px;
		background:#fff;
	&::-webkit-scrollbar {
		 display: none;
	 }

	&.showSidebar {
		 overflow-x: hidden;
		 overflow-y: auto;
	 }

	.el-menu {
		height: 100%; /*写给不支持calc()的浏览器*/
		height: -moz-calc(100% - 80px);
		height: -webkit-calc(100% - 80px);
		height: calc(100% - 80px);
		border-radius: 0px;
		background-color:#fff;
		border-right: 0px;
	}

	.el-submenu .el-menu-item {
		min-width: 60px;
	}
	.el-menu {
		width: 210px;
	}
	.el-menu--collapse {
		width: 60px;
	}

	.el-menu .el-menu-item, .el-submenu .el-submenu__title {
		height: 46px;
		line-height: 46px;
	}
	}
	.fa{
		color: white;
		font-size: 20px;
	}
	.menu-toggle {
		text-align: center;
		color: white;
		height: 26px;
		line-height: 30px;
	}
	.slide-fade-enter-active {
		transition: all 0.5s ease;
	}
	.slide-fade-leave-active {
		transition: all 0s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}
	.slide-fade-enter, .slide-fade-leave-to
		/* .slide-fade-leave-active for below version 2.1.8 */ {
		transform: translateX(10px);
		opacity: 0;
	}
	.content-container {
		background: #fff;
		flex: 1;
		overflow-y: auto;
		padding: 10px;
		padding-bottom: 1px;
	.content-wrapper {
		background-color: #fff;
		box-sizing: border-box;
	}
	}
	}
</style>
