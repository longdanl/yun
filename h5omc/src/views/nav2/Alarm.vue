<template>
	<section style="position: relative;top:-10px;">
		<el-form :inline="true" style="margin:6px 0 0 10px">
			<el-form-item style="float:right;margin-right:10px">
				<el-input placeholder="请输入查询信息" size="small"></el-input>
			</el-form-item>
			<el-form-item style="float:right;margin:2px 10px 0 0">
				<i :class="[rotate?'el-icon-refresh-left go':'el-icon-refresh-right aa']"></i>
			</el-form-item>
		</el-form>
		<el-form :inline="true" :model="alarmInfo"  style="margin: 8px 0 0 10px;">
			<el-select v-model="alarmInfo.alarmNum" size="small" placeholder="系统名" style="margin: 5px 10px 0 0;">
			</el-select>
			<!--<el-select v-model="alarmInfo.alarmType" placeholder="告警级别">
				<el-option label="严重告警" value="严重告警"></el-option>
				<el-option label="紧急告警" value="紧急告警"></el-option>
			</el-select>-->
			<el-form-item>
				<el-date-picker type="date" size="small" placeholder="发生时间" v-model="alarmInfo.alarmStart"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-date-picker type="date" size="small" placeholder="最后上报时间" v-model="alarmInfo.alarmEnd"></el-date-picker>
			</el-form-item>
		</el-form>
		<!--列表-->
		<template>
			<el-table :header-cell-style="{'background':'#f0f5f7','color':'#000000','padding':'0','border-bottom':'1px solid #cbcbcb'}" :cell-style="excelStyle" stripe v-loading="listLoading" style="width:1607px;left:10px;border:1px solid #cbcbcb">
				<el-table-column type="selection" width="43">
				</el-table-column>
				<el-table-column prop="system_disp_name" label="系统名" width="100">
				</el-table-column>
				<el-table-column prop="module_disp_name" label="模块名" width="100">
				</el-table-column>
				<el-table-column prop="level" label="告警级别" width="120">
				</el-table-column>
				<el-table-column prop="source" label="告警来源" width="120">
				</el-table-column>
				<el-table-column prop="type_desc" label="告警类型" width="160">
				</el-table-column>
				<el-table-column prop="subtype_desc" label="告警子类型" width="160">
				</el-table-column>
				<el-table-column prop="desc" label="告警描述" width="160">
				</el-table-column>
				<el-table-column prop="report_count" label="上报次数"  width="100">
				</el-table-column>
				<el-table-column prop="occur_time" label="发生时间" width="200px">
				</el-table-column>
				<el-table-column prop="last_report_time" label="最后上报时间" width="200px">
				</el-table-column>
				<el-table-column label="操作" width="142" class="showBtn">
					<template scope="scope">
						<el-button size="small" type="primary">确认</el-button>
						<el-button size="small" type="primary"><i class="fa fa-info" aria-hidden="true" style="font-size:15px;"></i>&nbsp;查看日志</el-button>
					</template>
				</el-table-column>
			</el-table>
		</template>
		<!--工具条-->
		<span style="float:left;position: relative;top:10px;right:-20px;">共<span style="color:#056dae">{{total}}</span>条记录，当前显示第&nbsp;<span style="color:#056dae">{{page}}</span>&nbsp;页</span>
		<el-pagination  style="float: right;margin:10px 10px 10px 0" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
						:page-sizes="[10, 20,50, 100]" :page-size="limit" layout="sizes, prev, pager, next"
						:total="total">
		</el-pagination>
	</section>
</template>
<script>
import {getAlarmList} from '@/api/alarm';
export default {
	data() {
		return {
			rotate:false,
			fullscreen:false,
			alarmInfo: {
				alarmNum:'',
				alarmType:'',
				alarmReset:'',
				alarmStart:'',
				alarmEnd:'',
			},
			limit:100,
			list: [],
			total: 0,
			page: 1,
			listLoading: false,
			sels: [],//列表选中列
		}
	},
	created() {
		//this.getAlarmList();
	},
	methods: {
		excelStyle({rowIndex, columnIndex}){
			if(rowIndex%2==0&&columnIndex!=9){
				return{
					'background':'#ffffff','color':'#000000','padding':'0','border-right':'1px dashed #c7c7c7'
				}
			}else if(rowIndex%2!=0&&columnIndex!=9){
				return{
					'background':'#f5f8fa','color':'#000000','padding':'0','border-right':'1px dashed #c7c7c7'
				}
			}else if(rowIndex%2==0&&columnIndex==9){
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
			let element = document.documentElement;
			if (this.fullscreen) {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			} else {
				if (element.requestFullscreen) {
					element.requestFullscreen();
				} else if (element.webkitRequestFullScreen) {
					element.webkitRequestFullScreen();
				} else if (element.mozRequestFullScreen) {
					element.mozRequestFullScreen();
				} else if (element.msRequestFullscreen) {
					// IE11
					element.msRequestFullscreen();
				}
			}
			this.fullscreen = !this.fullscreen;
		},
		// 当每页数量改变
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
			this.limit = val
		},
		// 当当前页改变
		handleCurrentChange(val) {
			this.page = val;
		},
		getAlarmList(){
			getAlarmList().then((res)=>{
				console.log(res)
				if(res.code==0){

				}else{
					this.$message({
						message: res.description,
						type: 'error'
					});
				}
			}).catch((err)=>{

			})
		}
	},
};

</script>

<style scoped lang="scss">
	.borderBottom{
		position: relative;
		height:45px;
		line-height: 45px;
		width:100%;
		background-color:#f0f5f7
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
</style>
