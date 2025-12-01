<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward">
					<span class="fa fa-chevron-left"></span>
				</view>
				<view class="col-8">用户登录</view>
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
				<form class="top">
					<view class="form-group underline">
						<view class="col-3 tip">
							用户名
						</view>
						<view class="col-7">
							<input type="text" needle="needle" msg="请输入用户名" class="noborder" v-model="username" name="username" placeholder="请输入用户名">
						</view>
					</view>
					<view class="form-group underline">
						<view class="col-3 tip">
							密码
						</view>
						<view class="col-7">
							<input type="text" password needle="needle" msg="请输入密码" class="noborder" v-model="password" name="password" placeholder="请输入密码">
						</view>
					</view>
					<view class="form-group text-right">
						<navigator url="/pages/user/findpassword">忘记密码？</navigator>
					</view>
					<view class="form-group">
						<button class="btn primary block" @click="login()">登录</button>
					</view>
					<view class="form-group">
						<button class="btn weixin block hide" @click="wxlogin()">微信登录</button>
					</view>
					<view class="form-group text-center">
						<navigator url="/pages/user/register">没有账号？立即注册</navigator>
					</view>
				</form>
			</view>
		</view>
	</view>
</template>
<script setup>
	import ajax from '../../assets/js/ajax';
	import { ref, reactive } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import config from '../../assets/js/config';
	const user = ref();
	const username = ref();
	const password = ref();
	onLoad(() => {
		
	});	
	const login = async() => {
		const data = await ajax({
			route:'user-app-login',
			'args[username]':username.value,
			'args[userpassword]':password.value,
			'userlogin':1
		});
		if(data.statusCode == 200 || data.statusCode == 201){
			uni.redirectTo({
				url:'/pages/index/index'
			})
		}else{
			uni.showToast({
				title:'用户名或密码错误，请重试',
				icon:'none'
			})
		}
	}
	const backForward = () => {
		uni.navigateBack();
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