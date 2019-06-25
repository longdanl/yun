<template>
	<section>
		<!--工具条-->
		<el-form :inline="true" :model="filters" style="margin-top: 10px">
			<el-button @click="handleAdd"><i class="fa fa-cloud-upload">上传文件</i></el-button>
			<el-button type="danger" @click="deleteFilesBatch" :disabled="this.sels.length===0">批量删除</el-button>
			<el-form-item class="btn" style="float:right;margin-right:30px">
				<el-button size="mini"><i class="fa fa-refresh" aria-hidden="true" @click="refresh"></i></el-button>
			</el-form-item>
			<el-form-item style="float:right;margin-right:30px">
				<el-input v-model="filters.memo" placeholder="请输入文件名" size="small" @keyup.native="getFilesByMemo"></el-input>
			</el-form-item>
		</el-form>
		<!--文件列表-->
		<div style="padding-top: 10px"></div>
		<el-table @sort-change='tableSortChange' @selection-change="selsChange" border stripe ref="singleTable" :data="files" element-loading-text="拼命加载中..." v-loading="fileLoading" style="width:1141px;" :body="true">
			<el-table-column :selectable='checkboxT'  type="selection" width="52">
			</el-table-column>
			<el-table-column prop="memo" label="备注" :show-overflow-tooltip="true" width="120" sortable='custom'>
			</el-table-column>
			<el-table-column prop="type" label="文件类型"  width="120" :formatter="formatType" sortable='custom'>
			</el-table-column>
			<el-table-column label="预览"  width="70">
				<template scope="scope">
					<i class="fa fa-play-circle-o" v-if="showFile" @click="handlePlay(scope.$index, scope.row)"></i>
				</template>
			</el-table-column>
			<el-table-column prop="filesize" label="文件大小" width="120" sortable='custom'>
			</el-table-column>
			<el-table-column prop="upload_timestamp" label="上传时间" width="180" sortable='custom'>
			</el-table-column>
			<el-table-column prop="username" label="上传用户" :show-overflow-tooltip="true" width="120">
			</el-table-column>
			<el-table-column prop="is_default" label="默认" width="68">
				<template scope="scope">
					<i class="fa fa-check-circle" style="color: green;font-size: 18px" v-show="scope.row.is_default==1" @click="ha(scope.$index, scope.row)"></i>
				</template>
			</el-table-column>
			<el-table-column prop="calling_numbers" label="主叫号码" :show-overflow-tooltip="true" width="150">
				<!--<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="scope.row.calling_numbers" placement="top">
						<div slot="content" v-for="(item,index) in scope.row.calling_numbers.split(',')">{{item}}<br/></div>
						<div class="haha">
							{{scope.row.calling_numbers}}
						</div>
					</el-tooltip>
				</template>-->
			</el-table-column>
			<el-table-column label="操作" width=140 class="showBtn" prop="is_default">
				<template scope="scope">
					<el-button size="small" type="primary" @click="handleEditMemo(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" :disabled="scope.row.is_default==1||scope.row.calling_numbers!=''" @click="deleteFile(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-pagination  style="float: right;margin-top: 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
						:page-sizes="[10, 20,50, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper"
						:total="total">
		</el-pagination>
		<!--音频播放界面-->
		<el-dialog title="点击按钮播放音频" v-model="playingMusic" :close-on-click-modal="false" style="width:50%;margin-left:25%;margin-bottom:-50%;text-align: center">
			<audio :src="basu" controls="controls" autoplay>您的浏览器不支持音频播放</audio>
		</el-dialog>
		<!--视频播放界面-->
		<el-dialog title="点击按钮播放视频" v-model="playingVideo" :close-on-click-modal="false" style="width:50%;margin-left:25%;margin-bottom:-50%;text-align: center">
			<video :src="basu" class="avatar" :beforeClose='stpoPlay' controls="controls" style="width:100%;height:100%;text-align: center">
                您的浏览器不支持视频播放
            </video>
		</el-dialog>
		<!--上传界面-->
		<el-dialog title="上传音频/视频" v-model="addFormVisible" :close-on-click-modal="false" style="width:50%;left:25%">
			<el-form>
				<el-form-item label="备注" prop="memo">
					<el-input v-model="memo" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="文件类型">
					<el-radio-group v-model="type">
						<el-radio class="radio" :label="0">音频</el-radio>
						<el-radio class="radio" :label="1">视频</el-radio>
					</el-radio-group></br>
				</el-form-item>
				<el-upload
						class="upload-demo"
						ref="upload"
						:limit="2"
						action="/api/crbt/10086/files"
						:auto-upload="false"
						:before-upload="beforeUpload">
					<el-button slot="trigger" size="small" type="file">选取文件</el-button>
					<el-button type="primary" size="small" @click="newSubmitForm()" class="yes-btn" :disabled="upClose">上传</el-button>
					<div slot="tip" class="el-upload__tip">上传文件大小不能超过500M</div>
				</el-upload>
			</el-form>
			<div slot="footer">
				<!--<el-button @click.native="closeUpload">取消</el-button>-->
				<el-button type="primary" @click="closeUp" class="yes-btn" :disabled="finish">完成</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false" style="width:50%;left:25%">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="备注" prop="memo">
					<el-input v-model="editForm.memo" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editMemo">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>
<script>
import qs from "qs"
import { getToken } from '../../utils/auth'
import {formatDate,FilesList} from '../../common/js/util'
import { deleteFilesBatch,upload,editMemo,deleteFile,getFiles,getFileByMemo,sortByFile} from '@/api/crbt'
export default {
	data() {
		return {
			filters: {
				memo:''
			},
			sortType:"asc",
			upClose:false,
			finish:true,
			videoUploadPercent:null,
			videoFlag:false,
			fileLoading:false,
			callings:[],
			dialogForm:"",
			file: {},
			memo:'',
			type:'',
			sels: '',//列表选中列
			blue1:'#409eff',
			username:'',
			time:'',
			files: [],
			total: null,
			page: 1,
			limit:100,
			dialogVisible: false,
			showFile:true,
			playingMusic:false,
			playingVideo:false,
			listLoading: false,
			sel: '',//列表选中列
			setFormVisible: false,
			editFormVisible: false,//编辑界面是否显示
			//编辑界面数据
			editForm: {
				memo: "",
			},
			show:true,
			basu:"",
			addFormVisible: false,//上传界面是否显示
			//上传界面数据
		}
	},
	created() {
		this.getFiles();
	},
	methods: {
        stpoPlay(){

        },
		//排序
		tableSortChange(column) {
			if (column.order === 'descending') {
				this.sortby = column.prop
				this.order = 'desc'
			} else {
				this.sortby = column.prop
				this.order = 'asc'
			}
			this.sortByFile()
		},
		sortByFile(){
			sortByFile(this.sortby,this.order).then((res)=>{
				console.log(res);
				if(this.sortby){
					if(res.code==0){
						this.files = res.list
						FilesList(this.files);
					}else{
						this.$message({
							message: res.description,
							type: 'error'
						});
					}
				}
			});
		},
		ha(){},
		beforeUpload (file) {
            this.upClose = true;
			const isLt500M = file.size / 1024 / 1024 < 500;
			if (!isLt500M) {
				this.$message.error('上传文件大小不能超过500M!');
			}else{
				let fd = new FormData()
				fd.append('file', file)
				fd.append('memo', this.memo)
				fd.append('type', this.type)
				upload(fd).then((res) => {
					if (res.code == 0) {
						let user = JSON.parse(sessionStorage.getItem('user'));
						this.username = user.username;
                        this.upClose = false;
                        this.finish = false;
						this.memo = "";
						this.type = "";
					} else {
						this.$message({
							message: res.description,
							type: 'error'
						});
					}
				});
				return true
			}
		},
		newSubmitForm () {
			if(!this.memo){
				this.$message({
					message: '请输入备注!',
					type: 'error'
				});
			}else if(this.type===''){
				this.$message({
					message: '请选择文件类型!',
					type: 'error'
				});
			}else{
				this.$refs.upload.submit();
			}
		},
		closeUp(){
			this.$message({
				message: '上传成功！',
				type: 'success'
			});
			this.upClose = false;
			this.finish = true;
			this.$refs.upload.clearFiles();
			this.addFormVisible = false;
			this.getFiles();
		},
		closeUpload(){
			//this.$refs.upload.abort()
			this.addFormVisible = false;
		},
		formatType: function (row) {
			return row.type == 1 ? '视频' :'音频';
		},
		// 当每页数量改变
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
			this.limit = val
			this.getFiles()
		},
		// 当当前页改变
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`);
			this.page = val;
			this.getFiles()
		},
		//获取文件列表
		async getFiles() {
			this.fileLoading = true;
			const res = await getFiles(qs.stringify({page:this.page,
				page_size: this.limit}));
			if(res.code==0){
				this.total = res.total;
				this.files = res.list;
				//时间转换
				FilesList(this.files)
			}else{
				this.$message({
					message:res.description,
					type: 'error'
				});
			}
			this.fileLoading = false;
		},
		//显示编辑界面
		handleEditMemo: function (index, row) {
			this.editFormVisible = true;
			this.editForm = Object.assign({}, row);
		},
		//编辑用户
		editMemo() {
			let id = this.editForm.id;
			editMemo(id,this.editForm).then((res)=>{
					if(res.code==0){
						this.$message({
							message: '修改成功!',
							type: 'success'
						});
						this.editFormVisible = false;
						this.getFiles()
					}else{
						this.$message({
							message: res.description,
							type: 'error'
						});
					}
				})
		},
		//删除文件
		deleteFile(index, row) {
			let para = {id: row.id};
			this.$confirm('确认删除该记录吗?', '提示', {
				type: 'warning'
			}).then(async() => {
				const res = await deleteFile(para.id);
				if(res.code==0){
					this.listLoading = false;
					this.files.splice(index, 1);
					this.$message({
						message: '删除成功',
						type: 'success'
					});
					this.getFiles();
				}else{
					this.$message({
						message:res.description,
						type: 'error'
					});
				}
			})
		},
		checkboxT(row, rowIndex){
			if(row.is_default==1||row.calling_numbers!=""){
				return false;//禁用
			}else{
				return true;//不禁用
			}
		},
		selsChange: function (sels) {
			this.sels = sels;
		},
		//批量删除文件
		deleteFilesBatch() {
			var ids = this.sels.map(item => item.id);
			this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'warning'
			}).then(async() => {
				this.listLoading = false;
				let para = { ids: ids };
				const res = await deleteFilesBatch(para);
				if(res.code==0){
					this.$message({
						message: '删除成功',
						type: 'success'
					});
					this.getFiles();
				}
				else{
					this.$message({
						message:res.description,
						type: 'error'
					});
				}
			})
		},
		//查询文件
		async getFilesByMemo() {
			//this.listLoading = true;
			const res = await getFileByMemo(this.filters.memo);
			if(res.code!=0 && this.filters.memo !=""){
				this.$message({
					message: res.description,
					type: 'error'
				});
			}else if(this.filters.memo ==""){
				this.getFiles()
			}else{
				console.log(res.list)
				if(res.list.length==0){
					this.files=""
					this.page = 1;
					this.total = 0
				}else{
					let list = new Array();
					for(let i=0;i<res.list.length;i++) {
						list.push(res.list[i]);
						this.files = list;
						this.page = 1;
						this.total = this.files.length
						FilesList(this.files)
					}
				}
			}
		},
		handleChoose: function (index, row) {
			if(row.is_default==0){
				row.is_default=1
			}else{
				row.is_default=0
			}
			console.log(row.is_default)
		},
		//预览/下载文件
		async handlePlay(index, row) {
			if(row.type === 0){
				this.playingMusic = true;
			}else{
				this.playingVideo = true;
			}
			var urlStr = window.location.href; //获取访问地址
			var urlArr = urlStr.split(":8080"); //截取字符串，存到数组中
			var urlArrPrev = urlArr[0]; // 获取.com之前的字符串
			var weburl1 = urlArrPrev.toString() + ":8080"; //拼接接口地址
			let access_token = getToken();
			console.log(row.filename)
			let para = {filename: row.filename};
			//this.basu ="http://172.16.10.66:8080/crbt/10086/files/"+para.filename+'?access_token='+access_token;
			this.basu =weburl1+"/crbt/10086/files/"+para.filename+'?access_token='+access_token;
			console.log(this.basu)
		},
		//刷新
		refresh() {
			this.listLoading = true;
			this.getFiles();
		},
		//显示新增文件界面
		handleAdd: function () {
			this.addFormVisible = true;
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
	.fa-play-circle-o{
		cursor:pointer;
		font-size: 20px
	}
	.fa-play-circle-o:hover{
		color:deepskyblue;
	}
	.cur {
		color: red;
	}
	.haha:hover{
		cursor:pointer;
	}
	.haha{
		width:150px;
		word-break: keep-all;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.el-table td {
		overflow:hidden;
		white-space:nowrap;
		text-overflow:ellipsis;
	}
</style>
