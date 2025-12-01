<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward"><span class="fa fa-chevron-left"></span></view>
				<view class="col-7">修改密码</view>
				<view class="col-2"></view>
			</view>
			<view class="page-content header">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content">
			<!--#endif-->
				<view class="list-box bg">
					<view>
						<view class="list-li">
							<view class="col-4x">
								<view>旧密码</view>
							</view>
							<view class="col-4l">
								<input v-model="oldpassword" password="true" placeholder="请输入旧密码"/>
							</view>
						</view>
						<view class="list-li">
							<view class="col-4x">
								<view>新密码</view>
							</view>
							<view class="col-4l">
								<input v-model="password" password="true" placeholder="请输入新密码"/>
							</view>
						</view>
						<view class="list-li">
							<view class="col-4x">
								<view>重复密码</view>
							</view>
							<view class="col-4l">
								<input v-model="password2" password="true" placeholder="请再次输入新密码"/>
							</view>
						</view>
						<view class="list-li">
							<button @click="modifypassword" class="btn primary block">修改密码</button>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
	import ajax from '../../assets/js/ajax';
	import { ref, reactive } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import config from '../../assets/js/config';
	const oldpassword = ref();
	const password = ref();
	const password2 = ref();
	onLoad(() => {
		
	});	
	const modifypassword = async() => {
		const data = await ajax({
			route:'user-phone-privatement-modifypass',
			oldpassword:oldpassword.value,
			'args[password]':password.value,
			'args[password2]':password2.value,
			modifyuserpassword:1
		});
		if(data.statusCode == 200){
			uni.showToast({
				title:'修改成功，请重新登录',
				icon:'none'
			})
			setTimeout(()=>{
				const data = ajax({
					route:'user-phone-logout'
				});
				uni.redirectTo({
					url:'/pages/user/index'
				})
			},1000)
		}else{
			uni.showToast({
				title:data.message,
				icon:'none'
			})
		}		
	}
	const backForward = () => {
		uni.navigateBack();
	}
</script>
<style>
	.ico{
		width: 100upx;
		height: 100upx;
	}
</style>