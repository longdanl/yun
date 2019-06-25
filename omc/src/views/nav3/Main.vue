<template>
	<section v-cloak>
		<div style="padding-top:10px"></div>
		<el-card class="box-card" style="width:100%;height:720px">
			<p class="title3">欢迎使用!</p>
			<div class="borderBottom1"></div>
			<!--<div class="logo">
				<img src="../../assets/xinyunLogo.jpg" alt="logo">
			</div>-->
		</el-card>
	</section>
</template>
<script>
</script>

<style>
	.title3{
		font-family:宋体;
		color:#505458;
		font-size: 18px;
		position: relative;
		bottom: 20px;
	}
	.borderBottom1{
		border-bottom: 1px solid #ccc;
		position: relative;
		bottom: 30px;
		margin-bottom:10%;
	}
	.logo{
		text-align: center;
		position: relative;
		margin-top: 200px;
	}
	.logo img{
		width:22%;
	}
	[v-cloak]{ display:none}
</style>
