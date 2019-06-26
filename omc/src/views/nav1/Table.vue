<template>
	<section>
		<!--工具条-->
		<el-form :inline="true" :model="filters" style="margin-top: 10px">
			<el-form-item>
				<el-button type="primary" @click="handleAdd" :disabled="usersDisable">新增用户</el-button>
			</el-form-item>
			<el-button type="danger" @click="deleteUsersBatch" :disabled="this.sels.length===0||usersDisable">批量删除</el-button>
			<el-form-item class="btn" style="float:right;margin-right:30px">
				<el-button size="mini"><i class="fa fa-refresh" aria-hidden="true" @click="refresh"></i></el-button>
			</el-form-item>
			<el-form-item style="float:right;margin-right:30px">
				<el-input v-model="filters.username" placeholder="请输入用户名" size="small" @keyup.native="getUsersByName"></el-input>
			</el-form-item>
		</el-form>
		<!--列表-->
		<template>
			<el-table border stripe @sort-change='tableSortChange' :data="users" element-loading-text="拼命加载中..." v-loading="listLoading" @selection-change="selsChange" style="width:1140px;">
				<el-table-column :selectable='checkboxL' type="selection" width="55">
				</el-table-column>
				<el-table-column prop="username" label="用户名" :show-overflow-tooltip="true" width="200" sortable='custom'>
				</el-table-column>
				<el-table-column prop="role_name" label="角色" :show-overflow-tooltip="true" width="200">
				</el-table-column>
				<el-table-column prop="phone" label="手机号码"  :show-overflow-tooltip="true" width="200">
				</el-table-column>
				<el-table-column prop="email" label="用户邮箱" :show-overflow-tooltip="true" width="200">
				</el-table-column>
				<el-table-column prop="active" label="当前状态" width="140px" :formatter="formatActive" sortable='custom'>
				</el-table-column>
				<el-table-column label="操作" width=144 class="showBtn">
					<template scope="scope">
						<el-button size="small" type="primary" :disabled="scope.row.username == name||usersDisable" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="danger" size="small" :disabled="scope.row.username == name||usersDisable" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</template>
		<!--工具条-->
		<el-pagination  style="float: right;margin-top: 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
						:page-sizes="[10, 20,50, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper"
						:total="total">
		</el-pagination>
		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false" style="width:50%;left:25%">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="editForm.username" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色" prop="role_name">
					<el-select v-model="editForm.role_id" placeholder="文件名">
						<el-option :label=item.name v-for="(item,index) in roleList" :value=item.id></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="用户密码" prop="password">
					<el-input v-model="editForm.password" placeholder="******" icon="edit"></el-input>
				</el-form-item>
				<el-form-item label="手机号码">
					<el-input v-model="editForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="用户邮箱">
					<el-input v-model="editForm.email"></el-input>
				</el-form-item>
				<el-form-item label="当前状态">
					<el-radio-group v-model="editForm.active">
						<el-radio class="radio" :label="1">启用</el-radio>
						<el-radio class="radio" :label="0">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="updateUsers">提交</el-button>
			</div>
		</el-dialog>
		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false" style="width:50%;left:25%">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="用户名" prop="username" >
					<el-input v-model="addForm.username" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色" prop="role_name" >
					<el-select v-model="addForm.role_id" placeholder="文件名">
						<el-option :label=item.name v-for="(item,index) in roleList" :value=item.id></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="用户密码" prop="password">
					<el-input v-model="addForm.password"></el-input>
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
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addUsers">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import qs from "qs"
import {getRolesList} from '@/api/roles';
import {sortBy,getUsersByName, getUsers, addUsers, deleteUsers, updateUsers, getUsersById, deleteUsersBatch } from '@/api/users'
export default {
	data() {
		return {
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
		let name1 = JSON.parse(sessionStorage.getItem('user'))
		this.name = name1.username;
		console.log(this.name)
		let per1 = JSON.parse(sessionStorage.getItem('per'));
		per1 = per1.toString()
		this.usersDisable = per1.indexOf("user:write")!=-1?false:true;
		this.getUsers();
		this.getRoles();
	},
	methods: {
		//获取角色列表
		getRoles() {
			getRolesList().then((res)=>{
				if(res.code==0){
					this.roleList = res.list;
					console.log(this.roleList)
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
			sortBy(this.sortby,this.order).then((res)=>{
				console.log(res);
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
				if (row.username == this.name) {
					return false;//禁用
				} else {
					return true;//不禁用
				}
			}
		},
		formatActive: function (row) {
			return row.active == 1 ? '启用' :'禁用';
		},
		// 当每页数量改变
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
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
				console.log(res)
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
			this.$refs.editForm.validate((valid) => {
				if(valid) {
					if(!this.editForm.role_id){
							this.$message({
								message: '请选择角色名',
								type: 'error'
							});
					}else{
						this.$confirm('确认修改该记录吗?', '提示', {
							type: 'warning'
						}).then(async() => {
							let id = this.editForm.id;
							const res = await updateUsers(id,this.editForm);
							if(res.code==0){
								this.$message({
									message: '修改成功',
									type: 'success'
								});
								this.editFormVisible = false;
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

<style scoped>
.btn .el-button{
	font-size: 20px;
	border:0;
	margin-right:-10px;
	color:#DFDFDF
 }
	.btn .el-button:hover{
		color:#20a0ff;
	}
</style>
