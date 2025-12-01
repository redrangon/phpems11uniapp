<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward">
					<span class="fa fa-chevron-left"></span>
				</view>
				<view class="col-8">绑定账号</view>
				<view class="col-1"></view>
			</view>
			<view class="page-content header">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content">
			<!--#endif-->
				<view class="list-box logobox">
					<view>
						<view class="list-li">
							<view class="text-center">
								<image src="/static/logo.png" class="circle logo"/>
							</view>
						</view>
					</view>
				</view>
				<form class="top" @submit="formSubmit">
					<view class="form-group underline">
						<view class="col-3 tip">
							用户名
						</view>
						<view class="col-7">
							<input type="text" needle="needle" msg="请输入用户名" class="noborder" name="username" placeholder="请输入用户名">
						</view>
					</view>
					<view class="form-group underline">
						<view class="col-3 tip">
							密码
						</view>
						<view class="col-7">
							<input type="password" needle="needle" msg="请输入密码" class="noborder" name="password" placeholder="请输入密码">
						</view>
					</view>
					<view class="form-group text-right">
						<navigator :url="'/pages/user/findpassword?openid=' + openid">忘记密码？</navigator>
					</view>
					<view class="form-group">
						<button class="btn primary block" form-type="submit">绑定账号</button>
					</view>
					<view class="form-group text-center">
						<navigator :url="'/pages/user/register?openid=' + openid">没有账号？立即注册</navigator>
					</view>
				</form>
			</view>
		</view>
	</view>
</template>
<script>
	
	export default {
		data() {
			return {
				openid:''
			}
		},
		onShow:function(){
			//
		},
		onLoad:function(e) {
			this.openid = e.openid
		},
		methods: {
			backForward:function(){
				uni.navigateBack();
			},
			formSubmit:function(e){
				var _this = this;
				var formdata = e.detail.value;
				var res = {};
				var index = null;
				res.username = base.xvars({value:formdata.username,attr:function(x){
					var data = {datatype:'username',type:'text',needle:'needle',msg:'错误的用户名！'};
					return base.fdata(data,x);
				}});
				res.password = base.xvars({value:formdata.password,attr:function(x){
					var data = {'datatype':'password',type:'password',needle:'needle',msg:'请输入正确的密码！'};
					return base.fdata(data,x);
				}});
				for(index in res)
				{
					if(!res[index].result){
						uni.showToast({
							title: res[index].message,
							icon:'none'
						});
						return false;
					}
				}
				uni.request({
					url: base.website+'user.php?action=login',
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'cookie':uni.getStorageSync('cookie')
					},
					method: 'POST',
					data:{
						'args[username]':formdata.username,
						'args[userpassword]':formdata.password,
						'userlogin':1,
						'bindaccount':1,
						'openid':this.openid
					},
					success: res => {					
						if(res.data.statusCode == '200' || res.data.statusCode == '201')
						{
							if (res.cookies && res.cookies.length>0) {
								let pecookie = '';
								res.cookies.map(cookie=>{
									cookie = cookie.split(";");
									cookie = cookie[0].split('=');
									pecookie += cookie[0]+'='+cookie[1]+';';
								});
								uni.setStorageSync('cookie',pecookie);
							}
							uni.reLaunch({
								'url':'/pages/user/index'
							})
						}
						else
						{
							uni.showToast({
								title: res.data.message,
								icon:'none'
							})
						}
					},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>
<style>
	.logobox{
		margin-top: 20upx;
		margin-bottom: 15upx;
	}
	.logo{
		width: 200upx;
		height: 200upx;
	}
</style>