<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="alarmInfo">
				<el-select v-model="alarmInfo.alarmNum" placeholder="系统编号">
					<el-option label="1" value="1"></el-option>
					<el-option label="2" value="2"></el-option>
				</el-select>
				<el-select v-model="alarmInfo.alarmType" placeholder="告警级别">
					<el-option label="严重告警" value="严重告警"></el-option>
					<el-option label="紧急告警" value="紧急告警"></el-option>
				</el-select>
				<el-select v-model="alarmInfo.alarmReset" placeholder="告警恢复选择">
					<el-option label="是" value="是"></el-option>
					<el-option label="否" value="否"></el-option>
				</el-select>
				<el-form-item>
					<el-date-picker type="date" placeholder="搜索起始时间" v-model="alarmInfo.alarmStart"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-date-picker type="date" placeholder="搜索结束时间" v-model="alarmInfo.alarmEnd"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getList">查询</el-button>
				</el-form-item>
				<el-form-item class="btn" style="float: right">
					<el-button size="mini"><i class="fa fa-refresh" aria-hidden="true" @click="refresh"></i></el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<template>
			<el-table :data="list" highlight-current-row v-loading="listLoading"  @selection-change="selsChange" style="width:1422px;">
				<el-table-column width="60">
					<i class="fa fa-plus-circle" style="font-size:20px;color:green"></i>
				</el-table-column>
				<el-table-column prop="alarmNum" label="系统编号" width="100">
				</el-table-column>
				<el-table-column prop="moduleNum" label="模块号" width="100">
				</el-table-column>
				<el-table-column prop="moduleName" label="模块名称" width="120">
				</el-table-column>
				<el-table-column prop="alarmType" label="告警级别" width="120">
				</el-table-column>
				<el-table-column prop="childDet" label="告警子类型描述" width="160">
				</el-table-column>
				<el-table-column prop="count" label="告警次数"  width="100">
				</el-table-column>
				<el-table-column prop="alarmReset" label="告警是否恢复" width="120">
				</el-table-column>
				<el-table-column prop="alarmStart" label="告警开始时间" width="200px">
				</el-table-column>
				<el-table-column prop="alarmEnd" label="告警结束时间" width="200px">
				</el-table-column>
				<el-table-column label="操作" width="140" class="showBtn">
					<template scope="scope">
						<el-button size="small" type="primary"><i class="fa fa-info" aria-hidden="true" style="font-size:15px;"></i>&nbsp;查看日志</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"  :total="total" style="float:right;">
				</el-pagination>
			</el-col>
		</template>
	</section>
</template>
<script>
export default {
	data() {
		return {
			alarmInfo: {
				alarmNum:'',
				alarmType:'',
				alarmReset:'',
				alarmStart:'',
				alarmEnd:'',
			},
			list: [],
			total: 0,
			page: 1,
			listLoading: false,
			sels: [],//列表选中列
		}
	},
	methods: {
		handleCurrentChange(val) {
			this.page = val;
			this.getList();
		},
		//刷新
		refresh(){
			this.listLoading = true;
			this.getList();
		},
		//获取用户列表
		getList: function () {
			let para = {
				page:this.page,
				alarmNum: this.alarmInfo.alarmNum,
				alarmType: this.alarmInfo.alarmType,
				alarmReset: this.alarmInfo.alarmReset,
				alarmStart: this.alarmInfo.alarmStart,
				alarmEnd: this.alarmInfo.alarmEnd,
				moduleNum:this.list.moduleNum,
				moduleName:this.list.moduleName,
				childDet:this.list.childDet,
				count:this.list.count,
			};
			this.listLoading = false;
			getAlarmListPage(para).then((res) => {
				this.total = res.data.total;
				this.list = res.data.list;
				this.listLoading = false;
				//NProgress.done();
			});
		},
		selsChange: function (sels) {
			this.sels = sels;
		},
	},
	mounted() {
		this.getList();
	}
};

</script>

<style scoped lang="scss">
  .btn .el-button{
	  font-size: 16px;
	  border:0;
	  margin-right:-10px;
	  color:darkgray
  }
  .btn .el-button:hover{
	  color:#20a0ff;
  }
</style>
