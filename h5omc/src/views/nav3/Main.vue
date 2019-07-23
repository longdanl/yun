<template>
	<section v-cloak>
		<div class="mainContainer">
			<div class="borderBottom"><p class="title3" style="padding:10px 0 0 10px">欢迎使用!</p></div>
			<div class="onebottom"></div>
			<div class="mainPicture"><img src="../../assets/bg3.png" alt="图片"></div>
		</div>
	</section>
</template>
<script>
	export default {
		data() {
			return{
				show: true
			}

		},
		methods:{

		}
	}
</script>
<style scoped>
	.mainContainer{
		width:100%;
		height:780px;
		position: relative;
		border:1px solid #cbcbcb
	}
	.mainPicture{
		width:100%;
		height:500px;
	}
	.mainPicture img{
		width:500px;
		height:500px;
		position: absolute;
		left:50%;
		margin-left:-250px ;
		top:50%;
		margin-top: -210px;
	}
	.onebottom{
		height:3px;
		background: -webkit-linear-gradient(#e8edef,#dfe4e6,#b6cad2); /* Safari 5.1 - 6.0 */
		background: -o-linear-gradient(#e8edef,#dfe4e6,#b6cad2); /* Opera 11.1 - 12.0 */
		background: -moz-linear-gradient(#e8edef,#dfe4e6,#b6cad2); /* Firefox 3.6 - 15 */
		background: linear-gradient(#e8edef,#dfe4e6,#b6cad2); /* 标准的语法 */
		position: relative;
		top:-18px
	}
	.borderBottom{
		top:-18px;
		position: relative;
		height:45px;
		line-height: 45px;
		width:100%;
		background-color:#f0f5f7
	}
	.title3{
		font-family:宋体;
		color:#505458;
		font-size: 18px;
		position: relative;
		bottom: 12px;
	}

	[v-cloak]{ display:none}
</style>
