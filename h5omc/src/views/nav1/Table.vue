<template>
	<section style="position: relative;top:-10px;">
		<el-form :inline="true" :model="filters" style="margin:6px 0 0 10px">
			<el-form-item>
				<el-button class="buttonCss" @click="handleAdd" :disabled="usersDisable"><i class="fa fa-plus-circle" aria-hidden="true" style="color:#8cd41d"></i> 添加</i></el-button>
			</el-form-item>
			<el-button class="buttonCss" @click="deleteUsersBatch" :disabled="this.sels.length===0||usersDisable"><i class="fa fa-times-circle" aria-hidden="true" style="color:#d13737"></i> 批量删除</el-button>
			<el-form-item style="float:right;margin-right:10px">
				<el-input v-model="filters.username" placeholder="请输入用户名" size="small" @keyup.native="getUsersByName"></el-input>
			</el-form-item>
			<el-form-item style="float:right;margin:2px 10px 0 0">
				<i :class="[rotate?'el-icon-refresh-left go':'el-icon-refresh-right aa']" @click="refresh"></i>
			</el-form-item>
		</el-form>
		<!--列表-->
		<template>
			<el-table :header-cell-style="{'background':'#f0f5f7','color':'#000000','padding':'0','border-bottom':'1px solid #cbcbcb'}" :cell-style="excelStyle" @sort-change='tableSortChange' :data="users" element-loading-text="拼命加载中..." v-loading="listLoading" @selection-change="selsChange" style="margin-bottom: 40px;position:relative;width:925px;left:10px;top:-10px;border:1px solid #cbcbcb;">
				<el-table-column  :selectable='checkboxL' type="selection" width="43">
				</el-table-column>
				<el-table-column v-for="(item,key) in tableKey"
								 :key="key"
								 :prop="item.value"
								 :label="item.name"
								 :show-overflow-tooltip="item.showTooltip"
								 :sortable="item.hasSort">
				</el-table-column>
				<el-table-column prop="active" label="当前状态" width="110px" sortable='custom'>
					<template scope="scope">
						                    <span v-if="scope.row.active=== 1">启用</span>
						<span v-else style="color:#ea2020">禁用</span>
						                </template>
				</el-table-column>-->
				<el-table-column label="操作" width=110 class="showBtn">
					<template scope="scope">
						<el-button size="small" type="text" :disabled="scope.row.username == name||scope.row.role_id==1||usersDisable" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="text" size="small" :disabled="scope.row.username == name||usersDisable||scope.row.role_id==1" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</template>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background-color:#fff">
			<span style="float:left;position: relative;top:-60px;">共<span style="color:#056dae;">{{total}}</span>条记录，当前显示第&nbsp;<span style="color:#056dae">{{page}}</span>&nbsp;页</span>
			<el-pagination style="float: right;position: relative;top:-60px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
						   :page-sizes="[10, 20,50, 100]" :page-size="limit" layout="sizes, prev, pager, next"
						   :total="total">
			</el-pagination>
		</el-col>
		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" style="width:50%;left:25%" :show-close="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="editForm.username" auto-complete="off" :disabled="editForm.username=='admin'"></el-input>
				</el-form-item>
				<el-form-item label="角色" prop="role_name">
					<el-select v-model="editForm.role_id" placeholder="角色" :disabled="editForm.username=='admin'">
						<el-option :label=item.name v-for="(item,index) in roleList" :value=item.id></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="用户密码" prop="password">
					<el-input v-model="editForm.password" placeholder="******" show-password></el-input>
				</el-form-item>
				<el-form-item label="手机号码">
					<el-input v-model="editForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="用户邮箱">
					<el-input v-model="editForm.email"></el-input>
				</el-form-item>
				<el-form-item label="当前状态">
					<el-radio-group v-model="editForm.active" :disabled="editForm.username=='admin'">
						<el-radio class="radio" :label="1">启用</el-radio>
						<el-radio class="radio" :label="0">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="closePwdEdit">取消</el-button>
				<el-button type="primary" @click.native="updateUsers">提交</el-button>
			</div>
		</el-dialog>
		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" width="460px" style="position:fixed;top:10%">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="用户名" prop="username" >
					<el-input v-model="addForm.username" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色" prop="role_name" >
					<el-select v-model="addForm.role_id" placeholder="角色名">
						<el-option :label=item.name v-for="(item,index) in roleList" :value=item.id></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="用户密码" prop="password">
					<el-input v-model="addForm.password"  show-password></el-input>
				</el-form-item>
				<el-form-item label="手机号码">
					<el-input v-model="addForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="用户邮箱">
					<el-input v-model="addForm.email"></el-input>
				</el-form-item>
				<el-form-item label="当前状态" prop="active">
					<el-radio-group v-model="addForm.active">
						<el-radio class="radio" :label="1">启用</el-radio>
						<el-radio class="radio" :label="0">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="closePwdAdd">取消</el-button>
				<el-button type="primary" @click.native="addUsers">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import qs from "qs"
	import {getRolesLists} from '@/api/roles';
	import {getRoleName,handleFullScreen} from "../../common/js/util";
	import {sortBy,getUsersByName, getUsers, addUsers, deleteUsers, updateUsers, getUsersById, deleteUsersBatch } from '@/api/users'
	export default {
		data() {
			return {
				tableKey: [{
					name: '用户名',
					value: 'username',
					hasSort:'custom',
					showTooltip:true,
				},{
					name: '角色',
					value: 'role_name',
					showTooltip:true,
				},{
					name: '手机号码',
					showTooltip:true,
					value: 'phone'
				},{
					name: '用户邮箱',
					showTooltip:true,
					value: 'email'
				}],
				passType:false,
					fullscreen:false,
					usersDisable:false,
					filters: {
				username: ''
			},
			roleList:[],
					sortType:"asc",
					users: [],
					limit: 100,
					total: null,
					name:'',
					page: 1,
					listLoading: false,
					sels: [],//列表选中列
					editFormVisible: false,//编辑界面是否显示
					editFormRules: {
				username: [
					{required: true, message: '请输入用户名', trigger: 'blur'}
				],
						role_id: [
					{required: true, message: '请输入角色名', trigger: 'blur'}
				],
			},
			rotate:false,
			//编辑界面数据
			editForm: {
				id: 0,
						username: '',
						password:'',
						phone: "",
						email: '',
						active: "",
						role_name:"",
						role_id:''
			},
			addFormVisible: false,//新增界面是否显示
					addFormRules: {
				username: [
					{required: true, message: '请输入用户名', trigger: 'blur'}
				],
						role_id: [
					{required: true, message: '请输入角色名', trigger: 'blur'}
				],
						password: [
					{required: true, message: '请输入密码', trigger: 'blur'}
				],
			},
			//新增界面数据
			addForm: {
				id: 0,
						username: '',
						password:'',
						phone: "",
						email: '',
						active:'',
						role_name:'',
						role_id:''
			}

		}
		},
		created() {
			let user = JSON.parse(sessionStorage.getItem('user'));
			this.name = user.username
			this.getRoleName()
			this.getUsers();
			this.getRoles();
		},
		methods: {
			excelStyle({rowIndex, columnIndex}){
				if(rowIndex%2==0&&columnIndex!=6){
					return{
						'background':'#ffffff','color':'#000000','padding':'0','border-right':'1px dashed #c7c7c7'
					}
				}else if(rowIndex%2!=0&&columnIndex!=6){
					return{
						'background':'#f5f8fa','color':'#000000','padding':'0','border-right':'1px dashed #c7c7c7'
					}
				}else if(rowIndex%2!=0&&columnIndex!=6){
					return{
						'background':'#f5f8fa','color':'#000000','padding':'0','border-right':'1px dashed #c7c7c7'
					}
				}else if(rowIndex%2==0&&columnIndex==6){
					return{
						'background':'#fff','color':'#000000','padding':'0'
					}
				}else{
					return{
						'background':'#f5f8fa','padding':'0'
					}
				}
			},
			getRowClass ({ row, column, rowIndex, columnIndex }) {
				if (rowIndex === 0) {
					return 'background:#f0f5f7'
				} else {
					return ''
				}
			},
			closePwdAdd(){
				this.addFormVisible = false
				this.passType = false;
			},
			closePwdEdit(){
				this.editFormVisible = false
				this.passType = false;
			},
			changePassType(){
				this.passType = !this.passType
			},
			handleFullScreen(){
				handleFullScreen(this.fullscreen);
				this.fullscreen = !this.fullscreen
			},
			getRoleName(){
				this.usersDisable = getRoleName(this.usersDisable,"user:write")
			},
			//获取角色列表
			getRoles() {
				getRolesLists().then((res)=>{
					if(res.code==0){
						this.roleList = res.list;
					}
				})
			},
			tableSortChange(column) {
				if (column.order === 'descending') {
					this.sortby = column.prop;
					this.order = 'desc'
				} else {
					this.sortby = column.prop;
					this.order = 'asc'
				}
				this.sortTable()
			},
			sortTable(){
				sortBy(this.page,this.limit,this.sortby,this.order).then((res)=>{
					if(this.sortby){
						if(res.code==0){
							this.users = res.list
						}else{
							this.$message({
								message: res.description,
								type: 'error'
							});
						}
					}
				});
			},
			checkboxL(row, rowIndex){
				if(this.usersDisable){
					return false;
				}else{
					if (row.username == this.name||row.role_id==1) {
						return false;//禁用
					} else {
						return true;//不禁用
					}
				}
			},
			// 当每页数量改变
			handleSizeChange(val) {
				this.limit = val
				this.getUsers()
			},
			// 当当前页改变
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//刷新
			refresh() {
				this.rotate=!this.rotate
				this.filters.username =""
				this.getUsers();
			},
			submit(e){
				let res = getUsersById(this.filters.id);
				if(res.code==0){
					let list = new Array();
					let user = res;
					list.push(user)
					this.users = list;
					this.filters.id="";
					this.page = 1;
					this.total = this.users.length
				}else{
					this.$message({
						message: res.description,
						type: 'error'
					});
				}

			},
			//查询用户ID
			async getUsersById() {
				//this.listLoading = true;
				const res = await getUsersByName(this.filters.id);
				if(res.code!=0 && this.filters.id !=""){
					this.$message({
						message: res.description,
						type: 'error'
					});
					this.filters.id=""
				}else if(this.filters.id ==""){
					this.$message({
						message: "请输入用户ID",
						type: 'error'
					});
				}else{
					let list = new Array();
					let user = res;
					list.push(user)
					this.users = list;
					this.filters.id="";
					this.page = 1;
					this.total = this.users.length
				}
			},
			//查询用户
			async getUsersByName() {
				//this.listLoading = true;
				const res = await getUsersByName(this.filters.username);
				if(res.code!=0 && this.filters.username !=""){
					this.$message({
						message: res.description,
						type: 'error'
					});
					this.filters.username=""
				}else if(res.list.length==0){
					this.users = "";
					this.total=0
				}else if(this.filters.username ==""){
					this.getUsers();
				}else{
					let list = new Array();
					for(let i=0;i<res.list.length;i++){
						list.push(res.list[i]);
						this.users = list;
						this.page = 1;
						this.total = this.users.length
					}
				}
			},
			//获取用户列表
			getUsers() {
				this.listLoading = true;
				getUsers(qs.stringify({page:this.page, page_size: this.limit})
				).then((res)=>{
					if(res.code==0){
						this.total = res.total;
						this.users = res.list;
					}else{
						this.$message({
							message: res.description,
							type: 'error'
						});
					}
				}).catch((err)=>{
					this.$message({
						message: err.description,
						type: 'error'
					});
				});
				this.listLoading = false
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除用户
			handleDel(index, row) {
				let para = {id: row.id};
				if(row.username!='admin'){
					this.$confirm('确认删除该记录吗?', '提示', {
						type: 'warning'
					}).then(async() => {
						const res = await deleteUsers(para.id);
						if(res.code==0){
							this.listLoading = false;
							this.editFormVisible = false;
							this.users.splice(index, 1);
							this.$message({
								message: '删除成功',
								type: 'success'
							});

							this.getUsers()
						}else{
							this.$message({
								message: res.description,
								type: 'error'
							});
						}
					})
				}
			},
			//批量删除用户
			deleteUsersBatch() {
				var ids = this.sels.map(item => item.id);
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(async() => {
					this.listLoading = false;
					let para = { ids: ids };
					const res = await deleteUsersBatch(para);
					if(res.code==0){
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers()
					}else{
						this.$message({
							message: res.description,
							type: 'error'
						});
					}
				})
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//编辑用户
			updateUsers() {
				this.$refs.editForm.validate(async(valid) => {
					if(valid) {
						if(!this.editForm.role_id){
							this.$message({
								message: '请选择角色名',
								type: 'error'
							});
						}else{
							let id = this.editForm.id;
							const res = await updateUsers(id,this.editForm);
							if(res.code==0){
								this.$message({
									message: '修改成功',
									type: 'success'
								});
								this.editFormVisible = false;
								this.passType = false
								this.getUsers();
							}else{
								this.$message({
									message: res.description,
									type: 'error'
								});
							}
						}
					}
				})
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					id: 0,
					username: '',
					password:'',
					phone: "",
					email: '',
					active: 1,
					role_id:"",
					role_name:''
				};
			},
			//新增用户
			addUsers(row) {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						let temp = /^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$/
						if(!this.addForm.username){
							this.$message({
								message: '请输入用户信息',
								type: 'error'
							});
						}else if (this.addForm.email && (!(temp).test(this.addForm.email))) {
							this.$message({
								message: '请输入正确的邮箱',
								type: 'error'
							});
						}else if (!this.addForm.role_id) {
							this.$message({
								message: '请选择角色名',
								type: 'error'
							});
						}else{
							addUsers(this.addForm).then((res)=>{
								if(res.code==0){
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.passType = false
									this.getUsers();
								}else{
									this.$message({
										message: res.description,
										type: 'error'
									});
								}
							})
						}
					}
				});
			},
		}
	}
</script>
<style>
	.buttonCss{
		color:#000;
		background-color:#f5f7f9;
		border:1px solid #d3dbde;
	}
	.buttonCss:hover{
		background-color:#fff;
		color:#000;
		border:1px solid #d3dbde
	}
	.btn{
		display: inline;
	}
	.btn .el-button{
		font-size: 20px;
		border:0;
		margin-right:-10px;
		margin-top: 10px;
		color:#DFDFDF;
		background-color:rgb(242,246,248);
	}
	.btn .el-button:hover{
		color:#20a0ff;
	}
	.icon-eye2{
		width:340px;
	}
	.aa,.go{
		font-size:20px;
		font-weight:900;
		color:#bfbec2
	}
	.aa{
		transition: all 0.5s;
	}
	.go{
		transform:rotate(360deg);
		transition: all 0.5s;
	}
	.el-button--text{
		color:#046cac
	}
	.el-dialog__header{
		background-color:#3c96ca;
		height:10px;
		line-height:0px;
	}
	.el-dialog__title {
		color: #fff;
		position: relative;
		bottom:10px;
	}
	.el-icon-close:before {
		color: #fff;
		text-align: center;
		position: relative;
		bottom: 8px;
		border-radius: 50%;
		font-size:20px;
	}
	.dialog-footer .el-button:last-child,.el-message-box__btns button:last-child{
		background-color: #3d97cb;
	}
	.dialog-footer .el-button:last-child:hover,.el-message-box__btns button:last-child:hover{
		background-color:#d9ecf3;
		color:#3d97cb;
	}
	.el-message-box{
		border: 0;
	}
	.el-message-box__header{
		background-color: #3d97cb;
	}
	.el-message-box__title{
		color:#fff
	}
	.el-radio__input.is-checked .el-radio__inner{
		background-color: #3d97cb;
		color:#3d97cb
	}
	.el-radio__input.is-checked .el-radio__inner {
		border-color:#3d97cb;
		background: #3d97cb;
	}
	.el-radio__input.is-checked+.el-radio__label {
		color: #3d97cb;
	}
</style>


