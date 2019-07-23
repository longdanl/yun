<template>
	<el-row class="container">
		<!--头部-->
		<el-col class="topbar-wrap">
			<img src="../assets/logo.png" alt="logo">
			<div class="topbar-btn">
				<div class="menuButtonList">
					<el-dropdown>
						<span class="el-dropdown-link" style="color: #fff">设置</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item style="font-size:12px;text-align: center"><span @click="setting">编辑资料</span></el-dropdown-item>
							<el-dropdown-item style="font-size:12px;text-align: center" divided><span @click="updatePass">修改密码</span></el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<span @click="logout">退出</span>
				</div>
				<div class="topbar-account">
					<i class="fa fa-user" style="font-size:14px;color:#fff;padding-left:18px;"></i>
					<span class="el-dropdown-link userinfo-inner">{{username}}</span>
					<!--<i class="fa fa-user" style="font-size:14px;color:#fff;padding-left:18px;"></i>
					<span class="el-dropdown-link userinfo-inner">{{username}}</span>
					<span>
						<i class="fa fa-bell" aria-hidden="true" style="font-size:16px;color:white;padding-left:10px"></i>
						<el-badge :value="count" :max="5" class="item" style="float:right;padding:12px 7px 0 7px;"></el-badge>
					</span>-->
				</div>
			</div>
		</el-col>
		<!--中间-->
		<el-col :span="24" class="main">
			<!--左侧导航-->
			<aside class="showSidebar">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" router unique-opened>
					<template v-for="(item,index) in router" v-if="item.menuShow">
						<el-submenu class='submenuList' v-if="!item.leaf" :index="index+''">
							<template slot="title" class="titleLists"><i :class="item.iconCls" style="color:rgb(107,180,213)"></i><strong slot="title">{{item.name}}</strong></template>
							<el-menu-item class='menuTitle' v-for="term in item.children" :key="term.path" :index="term.path" v-if="term.menuShow"
										  :class="$route.path==term.path?'is-active':''">
								<i class="fa fa-user-plus" aria-hidden="true" style="color:#74b7d5;position:relative;top:2px" v-if="item.name=='人员管理'"></i>
								<i class="fa fa-folder-open" aria-hidden="true" style="color:#74b7d5;position:relative;top:2px" v-if="item.name=='10086彩铃文件管理'"></i>
								<span slot="title" style="color:black">{{term.name}}</span>
								<i class="el-icon-caret-left" style="color:#fff;position:relative;float:right;left:60px;top:12px" v-if="$route.path==term.path"></i>
							</el-menu-item>
						</el-submenu>
						<el-menu-item style="background-color:#3a94c8;border-top:1px solid #5ab8ef;" v-else-if="item.leaf&&item.children&&item.children.length" :index="item.children[0].path"
									  :class="$route.path==item.children[0].path?'is-active':'mainCss'">
							<img src="../assets/main.png" alt="mainLogo" class="mainLogo"><span slot="title" style="color:#fff;font-size:18px;position: relative;top:-4px">{{item.children[0].name}}</span>
						</el-menu-item>
					</template>
				</el-menu>
			</aside>
			<!--设置界面-->
			<el-dialog title="设置" :visible.sync="userFormVisible" :close-on-click-modal="false" style="width:800px;left:25%;top:12%;height:800px" :show-close="false">
				<el-form :model="settingForm" label-width="80px" ref="settingForm">
					<el-form-item label="用户名" prop="username">
						<el-input v-model="settingForm.username" auto-complete="off" :disabled="username=='admin'"></el-input>
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
			<el-dialog title="修改密码" :visible.sync="passFormVisible" :close-on-click-modal="false" style="width:800px;left:29%;top:12%;height:800px" :show-close="false">
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
					<el-button @click.native="closePwd">取消</el-button>
					<el-button type="primary" @click.native="updatePwd">提交</el-button>
				</div>
			</el-dialog>
			<!--右侧内容区-->
			<div class="content-container">
				<div class="grid-content bg-purple-light">
					<div class="titleCss">
						<el-breadcrumb separator=">" class="breadcrumb-inner" style="padding-left:10px;line-height:47px">
							<strong style="float:left" v-if="">位置：</strong>
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								<span class="titleGuide">{{ item.name }}</span>
							</el-breadcrumb-item>
						</el-breadcrumb>
					</div>
					<div :span="24" class="content-wrapper">
						<transition name="slide-fade">
							<router-view></router-view>
						</transition>
					</div>
				</div>
			</div>
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
			this.router = JSON.parse(sessionStorage.getItem("router"))

		},
		data () {
			return {
				count:0,
				passwordType:false,
				fullscreen: false,
				router:[],
				username: '',
				sysName:'后台管理系统',
				sysName1:'Background Management System',
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
			closePwd(){
				this.passFormVisible = false;
				this.passwordType = false;
				this.passForm = "";
			},
			changePwdType(){
				this.passwordType = !this.passwordType
			},
			handleSelect(key, keyPath) {
				console.log(this);
				console.log(key,keyPath);
			},
			//折叠导航栏
			collapse: function () {
				this.collapsed = !this.collapsed;
			},
			setting(){
				this.userFormVisible=true;
				let user = JSON.parse(sessionStorage.getItem('user'));
				this.settingForm.username = user.username;
			},
			settingUser(){
				settingUser(this.settingForm).then((res)=>{
					if(res.code==0){
						this.userFormVisible=false;
						this.$refs['settingForm'].resetFields();
						this.$message({
							message:"修改成功",
							type:'success'
						});
						sessionStorage.removeItem('router');
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
				let reg = /^\d{5,}$/;
				if(this.passForm.new_password!=this.passForm.new_password2){
					this.$message({
						message:"两次输入密码不一致",
						type:'error'
					});
				}else{
					updatePwd(this.passForm).then((res)=>{
						console.log(this.passForm)
						if(res.code==0){
							this.passFormVisible=false;
							this.passForm = "";
							this.passwordType = false;
							this.$confirm('密码修改成功，是否重新登录?', '提示', {
								type: 'warning'
							}).then(() => {
								this.$router.replace('/login');
								sessionStorage.removeItem('router');
							})
						}else{
							this.passFormVisible=false;
							this.$message({
								message:res.description,
								type:'error'
							});
							this.passForm = ""
						}
					})
				}
			},
			logout(){
				this.$store.dispatch('user/logout')
						.then(() => {
							this.$message({
								message:"退出成功",
								type:'success'
							});
							this.$router.replace("/login");
							sessionStorage.removeItem('router');
						})
						.catch((error) => {
							this.loading = false;
							this.$message({
								message:error.description,
								type:'error'
							});
						});
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
<style lang="scss" scoped>
	@import '~scss_vars';
	::-ms-clear,::-ms-reveal{display:none;}
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
	.topbar-wrap {
		height: 80px;
		line-height: 80px;
		background: -webkit-linear-gradient(#076bab,#046dad,#086c84); /* Safari 5.1 - 6.0 */
		background: -o-linear-gradient(#076bab,#046dad,#086c84); /* Opera 11.1 - 12.0 */
		background: -moz-linear-gradient(#076bab,#046dad,#086c84); /* Firefox 3.6 - 15 */
		background: linear-gradient(#076bab,#046dad,#086c84); /* 标准的语法 */
		padding: 0;
	.topbar-btn {
		color: #fff;
		float: right;
	}
	.item {
		margin-top:-8px;
		left:-4px;
	}
	.topbar-account{
		position:relative;
		float: right;
		right:-80px;
		top:36px;
		background-color:rgb(5,92,141);
		line-height: 30px;
		height:30px;
		min-width:100px;
		border-radius:15px;
	}
	.menuButtonList{
		position:relative;
		float: right;
		top:4px;
		line-height: 30px;
		height:30px;
		width:90px;
		border-radius:15px;
	}
	.menuButtonList span:first-child::after{
		content: "";
		border-left:1px dotted black;
		font-size: 12px;
		margin-left: 10px;
		margin-right:4px;
	}
	/*.menuButtonList span:first-child{
		content: "";
		border-left:1px dotted black;
		font-size: 12px;
		margin-left: 10px;
		margin-right:4px;
	}*/
	.menuButtonList span:hover{
		cursor: pointer;
	}
	.userinfo-inner {
		cursor: pointer;
		color: #b8b7af;
		padding-left:10px;
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
	aside{
		position:relative;
		top:30px;
		min-width: 50px;
		background-color:rgb(240,249,253);
		/*border-right: 1px solid #b7d5df;*/
	&::-webkit-scrollbar {
		 display: none;
	 }

	&.showSidebar{
		 overflow-x: hidden;
		 overflow-y: auto;
	 }
	 .mainLogo{
		 position: relative;
		 top:-4px;
		 left:-8px
	 }
	.el-menu{
		height: 100%; /*写给不支持calc()的浏览器*/
		height: -moz-calc(100% - 80px);
		height: -webkit-calc(100% - 80px);
		height: calc(100% - 80px);
		background-color:rgb(240,249,253);

	}
	.el-submenu .el-menu-item{
		min-width: 60px;
	}
	.submenuList{
		border-bottom:1px solid #b9cad3;
		background-color:#d4e7f0;
	}
	.el-menu-item.is-active {
		background-color:#3eafe0 !important;
		border-left: 2px solid red;
	}
	.mainCss{
		background:#4098ca;
	}
	.el-menu {
		width: 209px;

	}
	.el-menu--collapse {
		width: 59px;
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
	.menuTitle{
		background-color:rgb(240,249,253);
	}
	.titleCss{
		z-index:999;
		position:fixed;
		background-color:rgb(237,246,250);
		width:100%;
		height:46px;
		line-height:46px;
		top:80px;
		left:210px;
		border-bottom:1px solid #d7e4ea;
	}
	.titleGuide{
		color:#000
	}
	.content-container {
		position: relative;
		top:80px;
		background:#fff;
		flex: 1;
		overflow-y: auto;
		padding:10px;
	.borderBottom{
		border-bottom: 1px solid #ccc;
		position: relative;
		left:-5px;
	}
	.content-wrapper {
		box-sizing: border-box;
		background-color:#fff;
	}
	}
	}
</style>
