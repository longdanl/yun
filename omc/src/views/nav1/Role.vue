<template>
	<section>
		<!--工具条-->
		<el-form :inline="true" :model="role" style="margin-top: 10px">
			<el-form-item>
				<el-button type="primary" @click="handleAdd">新增角色</el-button>
			</el-form-item>
			<el-button type="danger" @click="deleteRolesBatch" :disabled="this.sels.length===0">批量删除</el-button>
			<el-form-item class="btn" style="float:right;margin-right:30px">
				<el-button size="mini"><i class="fa fa-refresh" aria-hidden="true" @click="refresh"></i></el-button>
			</el-form-item>
			<el-form-item style="float:right;margin-right:30px">
				<el-input v-model="role.name" placeholder="请输入角色名" size="small" @keyup.native="getRolesByName"></el-input>
			</el-form-item>
		</el-form>
		<!--列表-->
		<el-table border stripe :data="roles" v-loading="rolesLoading" element-loading-text="拼命加载中..." @selection-change="selsChange" style="width:526px;">
			<el-table-column :selectable='checkboxL' type="selection" width="55">
			</el-table-column>
			<el-table-column prop="name" label="角色名称" width="300" sortable>
			</el-table-column>
			<!--<el-table-column prop="addTime" label="创建时间" width="300" sortable>
			</el-table-column>-->
			<el-table-column label="操作" width="170">
				<template scope="scope">
					<el-button size="small" type="primary" :disabled="scope.row.is_default==1" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" :disabled="scope.row.is_default==1" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-pagination  style="float: right;margin-top: 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
						:page-sizes="[10, 20,50, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper"
						:total="total">
		</el-pagination>
		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editRoleFormVisible" :close-on-click-modal="false" style="width:50%;left:25%">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="角色名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色权限:" prop="permissions">
					<template scope="scope">
						<el-checkbox-group v-model="editArray">
							 人员管理
							 <el-checkbox label="user:read" :key="1"  :disabled="editArray1.indexOf('user:write')!=-1" @change="haha">查看</el-checkbox>
							 <el-checkbox label="user:write" :key="2" @change="canEdit3">编辑</el-checkbox>
						</el-checkbox-group>
						<el-checkbox-group v-model="editArray" class='checkGroup'>
							 文件管理
							 <el-checkbox label="crbt_10086:read" :key="3" :disabled="editArray1.indexOf('crbt_10086:write')!=-1" @change="haha">查看</el-checkbox>
							 <el-checkbox label="crbt_10086:write" :key="4" @change="canEdit4">编辑</el-checkbox>
						</el-checkbox-group>
						</el-checkbox-group>
					</template>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editRoleFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--新增界面-->
		<el-dialog title="新增" v-model="RolesFormVisible" :close-on-click-modal="false" style="width:50%;left:25%">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="角色名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色权限:" prop="permissions">
					<el-checkbox-group v-model="addArray" class='checkGroup' >
						 人员管理
						 <el-checkbox label="user:read" :key="1" :disabled="editU" >查看</el-checkbox>
						 <el-checkbox label="user:write" :key="2" @change="canEdit1">编辑</el-checkbox>
					</el-checkbox-group>
					<el-checkbox-group v-model="addArray" class='checkGroup'>
						 文件管理
						 <el-checkbox label="crbt_10086:read" :key="3" :disabled="editC">查看</el-checkbox>
						 <el-checkbox label="crbt_10086:write" :key="4" @change="canEdit2">编辑</el-checkbox>
					</el-checkbox-group>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="handelcolse">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import qs from "qs";
import {getArray} from "../../common/js/util";
import {deleteRoles, editRole, addRoles,deleteRolesBatch,getRolesByName,getRolesList} from '@/api/roles';
export default {
	data() {
		return {
			role: {
				name: ''
			},
			addArray:[],
			editArray:[],
			editArray1:"",
			roles: [],
			page: 1,
			limit: 100,
			total: null,
			editU:false,
			editC:false,
			rolesLoading: false,
			sels: [],//列表选中列
			editRoleFormVisible: false,//编辑界面是否显示
			editLoading: false,
			editFormRules: {
				name: [
					{ required: true, message: '请输入角色名称', trigger: 'blur' }
				],
			},
			UClist:[],
			showUsers:false,
			showCrbt:false,
			//编辑界面数据
			editForm: {
				id: 0,
				name:'',
				permissions: '',
				editU1:"",
				editC1:"",
			},
			RolesFormVisible: false,//新增界面是否显示
			addLoading: false,
			addFormRules: {
				name: [
					{ required: true, message: '请输入角色名称', trigger: 'blur' }
				],
			},
			//新增界面数据
			addForm: {
				name: '',
				permissions:""
			}
		}
	},
	created() {
		this.getRoles();
	},
	methods: {
		haha(){
			console.log(this.editArray);
		},
		canEdit1(){
			this.editU = !this.editU;
			if(this.editU){
				let listU = this.addArray.toString();
				if(listU.indexOf("user:read")==-1){
					this.addArray.push("user:read");
				}
				console.log(this.addArray);
			}else{
				console.log(this.addArray);
			}
		},
		canEdit2(){
			this.editC = !this.editC
			if(this.editC){
				let listC = this.addArray.toString()
				if(listC.indexOf("crbt_10086:read")==-1){
					this.addArray.push("crbt_10086:read");
				}
				console.log(this.addArray);
			}else{
				console.log(this.addArray);
			}
		},canEdit3(){
			this.editArray1 = this.editArray.toString();
			if(this.editArray1.indexOf('user:write')!=-1&&this.editArray1.indexOf('user:read')==-1){
				this.editArray.push("user:read")
			}
			console.log(this.editArray1,this.editArray);
		},
		canEdit4(){
			this.editArray1 = this.editArray.toString();
			if(this.editArray1.indexOf('crbt_10086:write')!=-1&&this.editArray1.indexOf('crbt_10086:read')==-1){
				this.editArray.push("crbt_10086:read")
			}
			console.log(this.editArray1,this.editArray);
		},
		checkboxL(row, rowIndex){
			if(row.is_default==1){
				return false;//禁用
			}else{
				return true;//不禁用
			}
		},
		refresh(){
			this.getRoles();
		},
		// 当每页数量改变
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
			this.limit = val
			this.getRoles()
		},
		//查询
		async getRolesByName() {
			//this.listLoading = true;
			const res = await getRolesByName(this.role.name);
			if(res.code!=0 && this.role.name !=""){
				this.$message({
					message: res.description,
					type: 'error'
				});
				this.role.name =""
			}else if(res.list.length==0){
				this.roles = "";
			}else{
				let list = new Array();
				for(let i=0;i<res.list.length;i++){
					list.push(res.list[i]);
					this.roles = list;
					this.page = 1;
					this.total = this.roles.length
				}
			}
		},
		// 当当前页改变
		handleCurrentChange(val) {
			this.page = val;
			this.getRoles();
		},
		//获取角色列表
		getRoles() {
			this.rolesLoading = true;
			getRolesList(qs.stringify({page:this.page, page_size: this.limit})
			).then((res)=>{
				if(res.code==0){
					this.total = res.total;
					this.roles = res.list;
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
			this.rolesLoading = false;
		},
		//显示新增界面
		handleAdd: function () {
			this.RolesFormVisible = true;
			this.addForm = {
				name: '',
				permissions:""
			};
		},
		//新增
		addSubmit: function () {
			this.$refs.addForm.validate((valid) => {
				if (valid) {
					getArray(this.addArray);
					this.addForm.permissions = getArray(this.addArray).toString();
					if(this.addForm.name==""){
						this.$message({
							message: '请输入角色名称',
							type: 'error'
						});
					}else{
						let para = Object.assign({}, this.addForm);
						addRoles(para).then((res) => {
							if(res.code==0){
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();//清空addform
								this.RolesFormVisible = false;
								this.addArray =[];
								this.editU = false,
										this.editC=false,
										this.getRoles();
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
					}
				}
			})
		},
		handelcolse(){
			this.RolesFormVisible = false;
			this.editC = false;
			this.editU = false;
			this.addArray = [];
		},
		//删除
		handleDel: function (index, row) {
			this.$confirm('确认删除该记录吗?', '提示', {
				type: 'warning'
			}).then(() => {
				deleteRoles(row.id).then((res) => {
					if(res.code==0){
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getRoles();
					}else{
						this.$message({
							message: res.description,
							type: 'error'
						});
					}
				});
			})
		},
		selsChange: function (sels) {
			this.sels = sels;
		},
		//批量删除
		deleteRolesBatch() {
			var ids = this.sels.map(item => item.id);
			this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'warning'
			}).then(async() => {
				let para = { ids: ids };
				const res = await deleteRolesBatch(para);
				if(res.code==0){
					this.listLoading = false;
					this.$message({
						message: '删除成功',
						type: 'success'
					});
					this.getRoles()
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
			this.editRoleFormVisible = true;
			this.editForm = Object.assign({}, row);
			let array1 = [];
			let array2 = [];
			let newArr = [];
			let R = [];
			if(row.permissions.indexOf('user:write')!=-1){
				array1.push('user:read','user:write')
			}else if(row.permissions.indexOf('user:read')!=-1){
				array1.push('user:read')
			}else if(row.permissions ==""){
				array1 = []
			}
			if(row.permissions.indexOf('crbt_10086:write')!=-1){
				array2.push('crbt_10086:read','crbt_10086:write')
			}else if(row.permissions.indexOf('crbt_10086:read')!=-1){
				array2.push('crbt_10086:read')
			}else if(row.permissions ==""){
				array2 = []
			}
			R.push(array1.join(','));
			R.push(array2.join(','));
			R.forEach(item => {
				if (item) {
					newArr.push(item);
				}
			});
			let a = newArr.join(',');
			this.editArray = a.split(',');
			this.editArray1 = this.editArray.toString();
			console.log(a);
		},
		//编辑
		editSubmit: function () {
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					getArray(this.editArray);
					this.editForm.permissions = getArray(this.editArray).toString();
					let para = Object.assign({}, this.editForm);
					editRole(para.id,this.editForm).then((res) => {
						if(res.code==0){
							this.$message({
								message: '提交成功',
								type: 'success'
							});
							this.editRoleFormVisible = false;
							this.getRoles();
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
					})
				}
			})
		},
	},
	mounted() {
		this.getRoles();
	}
}

</script>

<style scoped>
 .btn .btn_child{
	 font-size: 16px;
	border:0;
	margin-right:-10px;
	color:darkgray
 }
	.btn .el-button:hover{
		color:#20a0ff;
	}
</style>
