<template>
	<section>
		<!--工具条-->
		<el-form :inline="true" :model="filters" style="margin-top: 10px">
			<el-form-item>
				<el-button type="primary" @click="handleAddPhone" :disabled="phoneFilesDis">新增</el-button>
			</el-form-item>
			<el-button type="danger" @click="deletePhoneBatch" :disabled="this.sels.length===0||phoneFilesDis">批量删除</el-button>
			<el-form-item class="btn" style="float:right;margin-right:30px">
				<el-button size="mini"><i class="fa fa-refresh" aria-hidden="true" @click="refresh"></i></el-button>
			</el-form-item>
			<el-form-item style="float:right;margin-right:30px">
				<el-input v-model="filters.calling_number" placeholder="请输入主叫号码" size="small"  @keyup.native="getPhones"></el-input>
			</el-form-item>
		</el-form>
		<!--彩铃列表-->
		<el-table @sort-change='tableSortChange' @selection-change="selsChange" border stripe ref="singleTable" :data="phoneList"style="width:756px;" element-loading-text="拼命加载中..." v-loading="phoneLoading">
			<el-table-column :selectable='checkboxT'  type="selection" width="52">
			</el-table-column>
			<el-table-column prop="is_default" label="默认" width="90" sortable='custom'>
				<template scope="scope">
					<i class="fa fa-check-circle" style="color: green;font-size: 18px" v-show="scope.row.is_default==1" @click="ha(scope.$index, scope.row)"></i>
				</template>
			</el-table-column>
			<el-table-column prop="calling_number" label="主叫号码" width="150">
			</el-table-column>
			<el-table-column prop="arbt_file_memo" label="音频文件" :show-overflow-tooltip="true" width="160">
			</el-table-column>
			<el-table-column prop="vrbt_file_memo" label="视频文件" :show-overflow-tooltip="true" width="160">
			</el-table-column>
			<el-table-column label="操作" width=143 class="showBtn" prop="is_default">
				<template scope="scope">
					<el-button size="small" type="primary"  :disabled="phoneFilesDis" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" :disabled="scope.row.is_default==1||phoneFilesDis" @click="deletePhone(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-pagination  style="float: right;margin-top: 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
						:page-sizes="[10, 20,50, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper"
						:total="total">
		</el-pagination>
		<!--主叫号码新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false" style="width:50%;left:25%">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="主叫号码" prop="calling_number">
					<el-input v-model="addForm.calling_number" auto-complete="off" type="text"></el-input>
				</el-form-item>
				<el-form-item label="音频文件" prop="arbt">
					<el-select v-model="addForm.arbt_file_id" placeholder="文件名">
						<el-option :label=item.memo v-for="(item,index) in arbtList" :value=item.id></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="视频文件" prop="vrbt">
					<el-select v-model="addForm.vrbt_file_id" placeholder="文件名">
						<el-option :label=item.memo v-for="(item,index) in vrbtList" :value=item.id ></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addPhone">提交</el-button>
			</div>
		</el-dialog>
		<!--主叫号码编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false" style="width:50%;left:25%">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="音频文件" prop="arbt">
					<el-select clearable v-model="editForm.arbt_file_id" placeholder="文件名">
						<el-option :label=item.memo v-for="(item,index) in arbtList" :value=item.id></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="视频文件" prop="vrbt">
					<el-select clearable v-model="editForm.vrbt_file_id" placeholder="文件名">
						<el-option :label=item.memo v-for="(item,index) in vrbtList" :value=item.id></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="updatePhone">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>
<script>
import qs from "qs"
import {callingPhone} from '../../common/js/util'
import {sortByPhone,updatePhone,deletePhone,deletePhoneBatch,getFile,addPhone,getPhones,getPhoneList} from '@/api/crbt'
export default {
	data() {
		return {
			phoneFilesDis:false,
			filters: {
				calling_number: ''
			},
			arbtList:[],
			vrbtList:[],
			phoneList:[],
            playing:true,
			sortType:"asc",
			is_default:false,
			limit: 100,
			total: null,
			page: 1,
			phoneLoading: false,
			sels: '',//列表选中列
			setFormVisible: false,
			editFormVisible: false,//编辑界面是否显示
			//编辑界面数据
			editForm: {
				arbt_file_id:'',
				vrbt_file_id:'',
				vrbt_file_memo:'',
				arbt_file_memo:'',
			},
			addFormVisible: false,//新增界面是否显示
			addFormRules: {
				calling_number: [
					{required: true, message: '请输入绑定号码', trigger: 'blur'}
				],
			},
			//新增界面数据
			addForm: {
				calling_number:'',
				arbt_file_id:'',
				vrbt_file_id:''
			},
		}
	},
	created() {
		let per1 = JSON.parse(sessionStorage.getItem('per'));
		per1 = per1.toString()
		this.phoneFilesDis = per1.indexOf("crbt_10086:write")!=-1?false:true;
		this.getPhoneList();
		this.getVideoFile();
		this.getMusicFile();
	},
	methods: {
        tableSortChange(column) {
            if (column.order === 'descending') {
                this.sortby = column.prop
                this.order = 'desc'
            } else {
                this.sortby = column.prop
                this.order = 'asc'
            }
            this.sortByPhone()
        },
        sortByPhone(){
            sortByPhone(this.sortby,this.order).then((res)=>{
                console.log(res);
                if(this.sortby){
                    if(res.code==0){
                        this.phoneList = res.list
                        //callingPhone(this.phoneList)
                    }else{
                        this.$message({
                            message: res.description,
                            type: 'error'
                        });
                    }
                }
            });
        },
		checkboxT(row, rowIndex){
			if(this.phoneFilesDis){
				return false;
			}else{
				if(row.is_default==1){
					return false;//禁用
				}else{
					return true;//不禁用
				}
			}
		},
		formatActive: function (row) {
			return row.active == 1 ? '启用' :'禁用';
		},
		//刷新
		refresh() {
			this.getPhoneList();
		},
		//查询绑定号码
		async getPhones() {
			const res = await getPhones(this.filters.calling_number);
			if(res.code!=0 && this.filters.calling_number !=""){
				this.$message({
					message: res.description,
					type: 'error'
				});
			}else if(this.filters.calling_number ==""){
				this.getPhoneList()
			}else{
				for(let i=0;i<res.list.length;i++){
					if(res.list.length===0||res.list[i].is_default==1){
						this.phoneList = ""
					}else{
						if(res.list[i].is_default!=1){
							this.phoneList = res.list.filter(item =>item.is_default !=1);
							console.log(this.phoneList)
							for(let j=0;j<this.phoneList.length;j++){
								const pho1 = this.phoneList[j].calling_number+""
								const pho2 = pho1.substring(0,3);
								console.log(pho1+"--1")
								const pho3 = pho1.substring(3,7);
								//console.log(pho3+"--2")
								const pho4 = pho1.substring(7,10);
								//console.log(pho4+"--3")
								const pho5 = pho2+pho3+pho4;
								console.log(pho5)
								this.phoneList[j].calling_number = pho5
							}
							this.page = 1;
							this.total = this.phoneList.length
						}
					}
				}
			}
		},
		//删除用户
		deletePhone(index, row) {
			let para = {id: row.id};
			this.$confirm('确认删除该记录吗?', '提示', {
				type: 'warning'
			}).then(async() => {
				const res = await deletePhone(para.id);
				if(res.code==0){
					this.listLoading = false;
					this.phoneList.splice(index, 1);
					this.$message({
						message: '删除成功',
						type: 'success'
					});
					this.getPhoneList();
				}else{
					this.$message({
						message:res.description,
						type: 'error'
					});
				}
			})
		},
		selsChange: function (sels) {
			this.sels = sels;
		},
		//批量删除用户
		deletePhoneBatch() {
			var ids = this.sels.map(item => item.id);
			this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'warning'
			}).then(async() => {
				this.listLoading = false;
				let para = { ids: ids };
				const res = await deletePhoneBatch(para);
				if(res.code==0){
					this.$message({
						message: '删除成功',
						type: 'success'
					});
					this.getPhoneList();
				}
				else{
					this.$message({
						message:res.description,
						type: 'error'
					});
				}
			})
		},
		async getVideoFile(row){
			const res = await getFile();
			let list = new Array();
			list = res.list;
			let vemp = /^vrbt_/;
			let videoList = list.filter(item =>item.filename = (vemp).test(item.filename));
			this.vrbtList = videoList;
			for(let i=0;i<videoList.length;i++){
				this.addForm.vrbt_file_id = videoList[i].id;
			}
		},
		async getMusicFile(){
			const res = await getFile();
			let list = new Array();
			list = res.list;
			let aemp = /^arbt_/;
			let musicList = list.filter(item =>item.filename = (aemp).test(item.filename));
			this.arbtList = musicList;
			for(let i=0;i<musicList.length;i++){
				this.addForm.arbt_file_id = musicList[i].id;
			}
		},
		//显示编辑界面
		handleEdit: function (index, row) {
			console.log(row.id)
			this.editFormVisible = true;
			this.editForm = Object.assign({}, row);
			if(this.editForm.arbt_file_id ==-1){
				this.editForm.arbt_file_id = "";
			}
			if(this.editForm.vrbt_file_id ==-1){
				this.editForm.vrbt_file_id = "";
			}
		},
		//编辑用户
		updatePhone() {
			this.$confirm('确认修改该记录吗?', '提示', {
				type: 'warning'
			}).then(async() => {
				let arbt_file_id = this.editForm.arbt_file_id==""?-1:this.editForm.arbt_file_id
				let vrbt_file_id = this.editForm.vrbt_file_id==""?-1:this.editForm.vrbt_file_id
				let id = this.editForm.id;
				const res = await updatePhone(id,{arbt_file_id:arbt_file_id,vrbt_file_id:vrbt_file_id});
				if(res.code==0){
					this.editFormVisible = false;
					this.$message({
						message: '修改成功',
						type: 'success'
					});
					this.getPhoneList();
				}else{
					this.$message({
						message: res.description,
						type: 'error'
					});
				}
			})
		},
		//显示新增界面
		handleAddPhone: function () {
			this.addFormVisible = true;
			this.addForm = {
				calling_number:'',
				arbt_file_memo:'',
				vrbt_file_memo:''
			};
		},
		//新增用户
		addPhone() {
			if(!this.addForm.calling_number){
				this.$message({
					message: '请输入绑定号码',
					type: 'error'
				});
			}else{
				addPhone(this.addForm).then((res)=>{
					if(res.code!=0){
						this.$message({
							message:res.description,
							type: 'error'
						});
					}else{
						this.$message({
							message: '提交成功',
							type: 'success'
						});
						console.log(JSON.stringify(res));
						this.addFormVisible = false;
						this.addLoading = false;
						this.$refs['addForm'].resetFields();
						console.log(res);
						this.getPhoneList();
					}
				})
			}
		},
		// 当每页数量改变
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
			this.limit = val
			this.getPhoneList()
		},
		// 当当前页改变
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`);
			this.page = val;
			this.getPhoneList()
		},
		//获取号码列表
		async getPhoneList() {
			this.phoneLoading = true;
			const res = await getPhoneList(qs.stringify({page:this.page,
				page_size: this.limit}))
			if(res.code==0){
				console.log(res)
				this.total = res.total;
				this.phoneList = res.list;
			}else{
				this.$message({
					message: res.description,
					type: 'error'
				});
			}
			this.phoneLoading = false
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
	.el-table .success-row {
		background: red;

	}
	.isPlaying .fa{
		font-size: 40px;
		color: red;
	}
	.fa-play-circle-o{
		cursor:pointer;
		font-size: 20px
	}
	.showMusicList{
		display: none;
	}
	.showList:hover{
		display: block;
	}
</style>
