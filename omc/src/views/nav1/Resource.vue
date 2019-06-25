<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-button type="primary" @click="handleAdd">增加资源</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<div>
			<div>
				<vue-ztree :list.sync='ztreeDataSource' :expand='expandClick' :is-open='false'></vue-ztree>
			</div>
		</div>
		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="资源名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>
<script>
export default {
	data() {
		return {
			filters: {
				name: ''
			},
			users: [],
			total: 0,
			page: 1,
			listLoading: false,
			sels: [],//列表选中列
			ztreeDataSource:[
				{
					id:1,
					name:"人员管理",
					children:[
						{
							id:2,
							name:"用户管理",
					    },
						{
							id:3,
							name:"角色管理",
					    }
					]
				},
				{
					id:4,
					name:"告警管理",
					children:[
						{
							id:5,
							name:"告警查询",
					    },
						{
							id:6,
							name:"告警日志",
						}
					]
				},
			],
			addFormVisible: false,//新增界面是否显示
			addLoading: false,
			addFormRules: {
				name: [
					{ required: true, message: '请输入用户名', trigger: 'blur' }
				]
			},
			//新增界面数据
			addForm: {
				id:'',
				name: ''
			}

		}
	},
	methods: {
		//显示新增界面
		handleAdd: function () {
			this.addFormVisible = true;
			this.addForm = {
				id:+new Date(),
				name: ''
			};
		},
		//新增
		addSubmit: function () {
			this.$refs.addForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.addLoading = true;
						//NProgress.start();
						//let para = Object.assign({}, this.addForm);
						this.ztreeDataSource.push({id:this.addForm.id,name:this.addForm.name,children:[]});
						console.log(this.ztreeDataSource);
						this.$message({
							message: '提交成功',
							type: 'success'
						});
						this.$refs['addForm'].resetFields();
						this.addFormVisible = false;
						/*addUser(para).then((res) => {
							this.addLoading = false;
							//NProgress.done();
							this.$message({
								message: '提交成功',
								type: 'success'
							});
							this.$refs['addForm'].resetFields();
							this.addFormVisible = false;
						});*/
					});
				}
			});
		},
		expandClick: function (m) {
			console.log(JSON.parse(JSON.stringify(m)));
			// 点击异步加载
			if (m.isExpand) {
				// 动态加载子节点, 模拟ajax请求数据
				// 请注意 id 不能重复哦。
				if (m.hasOwnProperty("children")) {

					m.loadNode = 1; // 正在加载节点

					setTimeout(() => {

						m.loadNode = 2; // 节点加载完毕

						m.isFolder = !m.isFolder;

						m.children.push({
							id: +new Date(),
							name: "动态加载节点1",
							path: "",
							clickNode: false,
							isFolder: false,
							isExpand: false,
							loadNode: 0,
							children: [{
								id: +new Date() + 1,
								name: "动态加载末节点",
								path: "",
								clickNode: false,
								isExpand: false,
								isFolder: false,
								loadNode: 0
							}]
						})
					}, 1000)

				}
			}
		}
	}
}

</script>

<style scoped>

</style>
