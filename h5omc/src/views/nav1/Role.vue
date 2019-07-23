<template>
	<section style="position: relative;top:-10px">
		<el-form :inline="true" :model="role" style="margin: 6px 0 0 10px">
			<el-form-item>
				<el-button class='buttonCss' @click="handleAdd" :disabled="rolesDisable"><i class="fa fa-plus-circle" aria-hidden="true" style="color:#8cd41d"></i> 添加</i></el-button></el-button>
			</el-form-item>
			<el-button class="buttonCss" @click="deleteRolesBatch" :disabled="this.sels.length===0||rolesDisable"><i class="fa fa-times-circle" aria-hidden="true" style="color:#d13737"></i> 批量删除</el-button>
			<el-form-item style="float:right;margin-right:10px">
				<el-input v-model="role.name" placeholder="请输入角色名" size="small" @keyup.native="getRolesByName"></el-input>
			</el-form-item>
			<el-form-item style="float:right;margin:2px 10px 0 0">
				<i :class="[rotate?'el-icon-refresh-left go':'el-icon-refresh-right aa']" @click="refresh"></i>
			</el-form-item>
		</el-form>
		<!--列表-->
		<el-table :header-cell-style="{'background':'#f0f5f7','color':'#000000','padding':'0','border-bottom':'1px solid #cbcbcb'}" :cell-style="excelStyle" @sort-change='tableSortChange' :data="roles" v-loading="rolesLoading" element-loading-text="拼命加载中..." @selection-change="selsChange" style="width:405px;margin-left:10px;margin-bottom: 40px;top:-12px;border:1px solid #cbcbcb">
			<el-table-column :selectable='checkboxL' type="selection" width="43">
			</el-table-column>
			<el-table-column prop="name" label="角色名称" width="250" sortable='custom' show-overflow-tooltip>
			</el-table-column>
			<!--<el-table-column prop="addTime" label="创建时间" width="300" sortable>
			</el-table-column>-->
			<el-table-column label="操作" width="110">
				<template scope="scope">
					<el-button size="small" type="text" :disabled="scope.row.is_default==1||rolesDisable" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="text" size="small" :disabled="scope.row.is_default==1||rolesDisable" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background-color:#fff">
			<span style="float:left;position: relative;top:-60px;">共<span style="color:#056dae;">{{total}}</span>条记录，当前显示第&nbsp;<span style="color:#056dae">{{page}}</span>&nbsp;页</span>
			<el-pagination style="float: right;position: relative;top:-60px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
						   :page-sizes="[10, 20,50, 100]" :page-size="limit" layout="sizes, prev, pager, next"
						   :total="total">
			</el-pagination>
		</el-col>
		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editRoleFormVisible" :close-on-click-modal="false" width="460px" style="position:fixed;top:20%">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="角色名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色权限:" prop="permissions">
					<template scope="scope">
						<el-checkbox-group v-model="editArray">
							 <el-form-item style="display: inline-block">用户管理：</el-form-item>
							 <el-checkbox label="user:read" :key="1"  :disabled="editArray1.indexOf('user:write')!=-1">查看</el-checkbox>
							 <el-checkbox label="user:write" :key="2" @change="canEdit3">编辑</el-checkbox>
						</el-checkbox-group>
						<el-checkbox-group v-model="editArray" class='checkGroup'>
							<el-form-item style="display: inline-block">文件管理：</el-form-item>
							 <el-checkbox label="crbt_10086:read" :key="3" :disabled="editArray1.indexOf('crbt_10086:write')!=-1">查看</el-checkbox>
							 <el-checkbox label="crbt_10086:write" :key="4" @change="canEdit4">编辑</el-checkbox>
						</el-checkbox-group>
						<!--<el-checkbox-group v-model="editArray" class='checkGroup'>
							<el-form-item style="display: inline-block">告警管理：</el-form-item>
							 <el-checkbox label="alarm:read" :key="5" :disabled="editArray1.indexOf('alarm:write')!=-1">查看</el-checkbox>
							 <el-checkbox label="alarm:write" :key="6" @change="canEdit5">编辑</el-checkbox>
						</el-checkbox-group>-->
					</template>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editRoleFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="RolesFormVisible" :close-on-click-modal="false" width="460px" style="position:fixed;top:20%">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="角色名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色权限:" prop="permissions">
					<el-checkbox-group v-model="addArray" class='checkGroup' >
						 <el-form-item style="display: inline-block">用户管理：</el-form-item>
						 <el-checkbox label="user:read" :key="1" :disabled="editU" >查看</el-checkbox>
						 <el-checkbox label="user:write" :key="2" @change="canEdit1">编辑</el-checkbox>
					</el-checkbox-group>
					<el-checkbox-group v-model="addArray" class='checkGroup'>
						 <el-form-item style="display: inline-block">文件管理：</el-form-item>
						 <el-checkbox label="crbt_10086:read" :key="3" :disabled="editC">查看</el-checkbox>
						 <el-checkbox label="crbt_10086:write" :key="4" @change="canEdit2">编辑</el-checkbox>
					</el-checkbox-group>
					<!--<el-checkbox-group v-model="addArray" class='checkGroup'>
						 告警管理
						 <el-checkbox label="alarm:read" :key="5" :disabled="editA">查看</el-checkbox>
						 <el-checkbox label="alarm:write" :key="6" @change="canEdit6">编辑</el-checkbox>
					</el-checkbox-group>-->
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
import {getArray,getRoleName,handleFullScreen} from "../../common/js/util";
import {deleteRoles, editRole, addRoles,deleteRolesBatch,getRolesByName,getRolesList,sortBy} from '@/api/roles';
import {getUsers} from '@/api/users';
export default {
	data() {
		return {
			rotate:false,
			fullscreen:false,
			rolesDisable:false,
			role: {
				name: ''
			},
			sortType:"asc",
			addArray:[],
			editArray:[],
			editArray1:"",
			roles: [],
			page: 1,
			limit: 100,
			total: null,
			editU:false,
			editC:false,
			editA:false,
			rolesLoading: false,
			sels: [],//列表选中列
			editRoleFormVisible: false,//编辑界面是否显示
			editLoading: false,
			editFormRules: {
				name: [
					{ required: true, message: '请输入角色名称', trigger: 'blur' }
				]
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
		this.getRoleName()
	},
	methods: {
		excelStyle({rowIndex, columnIndex}){
			if(rowIndex%2==0&&columnIndex!=2){
				return{
					'background':'#ffffff','color':'#000000','padding':'0','border-right':'1px dashed #c7c7c7'
				}
			}else if(rowIndex%2!=0&&columnIndex!=2){
				return{
					'background':'#f5f8fa','color':'#000000','padding':'0','border-right':'1px dashed #c7c7c7'
				}
			}else if(rowIndex%2==0&&columnIndex==2){
				return{
					'background':'#fff','color':'#000000','padding':'0'
				}
			}else{
				return{
					'background':'#f5f8fa','padding':'0'
				}
			}
		},
		handleFullScreen(){
			handleFullScreen(this.fullscreen);
			this.fullscreen = !this.fullscreen
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
						this.roles = res.list
					}else{
						this.$message({
							message: res.description,
							type: 'error'
						});
					}
				}
			});
		},
		getRoleName(){
			this.rolesDisable = getRoleName(this.rolesDisable,"user:write")
		},
		canEdit1(){
			this.editU = !this.editU;
			if(this.editU){
				let listU = this.addArray.toString();
				if(listU.indexOf("user:read")==-1){
					this.addArray.push("user:read");
				}
			}
		},
		canEdit2(){
			this.editC = !this.editC
			if(this.editC){
				let listC = this.addArray.toString()
				if(listC.indexOf("crbt_10086:read")==-1){
					this.addArray.push("crbt_10086:read");
				}
			}
		},
		canEdit6(){
			this.editA = !this.editA
			if(this.editA){
				let listA = this.addArray.toString()
				if(listA.indexOf("alarm:read")==-1){
					this.addArray.push("alarm:read");
				}
			}
		},canEdit3(){
			this.editArray1 = this.editArray.toString();
			if(this.editArray1.indexOf('user:write')!=-1&&this.editArray1.indexOf('user:read')==-1){
				this.editArray.push("user:read")
			}
		},
		canEdit4(){
			this.editArray1 = this.editArray.toString();
			if(this.editArray1.indexOf('crbt_10086:write')!=-1&&this.editArray1.indexOf('crbt_10086:read')==-1){
				this.editArray.push("crbt_10086:read")
			}
		},
		canEdit5(){
			this.editArray1 = this.editArray.toString();
			if(this.editArray1.indexOf('alarm:write')!=-1&&this.editArray1.indexOf('alarm:read')==-1){
				this.editArray.push("alarm:read")
			}
		},
		checkboxL(row, rowIndex){
			if(this.rolesDisable){
				return false;
			}else{
				if(row.is_default==1){
					return false;//禁用
				}else{
					return true;//不禁用
				}
			}
		},
		refresh(){
			this.rotate=!this.rotate
			this.role.name =""
			this.getRoles();
		},
		// 当每页数量改变
		handleSizeChange(val) {
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
				this.total=0
			}else if(this.role.name ==""){
				this.getRoles();
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
										this.editA=false,
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
			this.editA = false;
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
			let array3 = [];
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
			if(row.permissions.indexOf('alarm:write')!=-1){
				array3.push('alarm:read','alarm:write')
			}else if(row.permissions.indexOf('alarm:read')!=-1){
				array3.push('alarm:read')
			}else if(row.permissions ==""){
				array3 = []
			}
			R.push(array1.join(','));
			R.push(array2.join(','));
			R.push(array3.join(','));
			R.forEach(item => {
				if (item) {
					newArr.push(item);
				}
			});
			let a = newArr.join(',');
			this.editArray = a.split(',');
			this.editArray1 = this.editArray.toString();
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

<style>
	.buttonCss{
		color:#000;
		background-color:#f5f7f9;
		border:1px solid #d3dbde
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
	.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
		background-color:#3d97cb;
		border-color:#3d97cb;
	}
	.el-checkbox__input.is-checked+.el-checkbox__label {
		color:#3d97cb;
	}
</style>
