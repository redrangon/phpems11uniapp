<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1"><span class="fa"></span></view>
				<view class="col-8">个人中心</view>
				<view class="col-1"></view>
			</view>
			<view class="page-content header footer">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content footer">
			<!--#endif-->
				<view class="list-box bg">
					<view v-if="user">
						<view class="list-li">
							<div class="col-3">
								<div class="rows illus">
									<image v-if="user.userphoto" :src="config.host + user.userphoto" class="circle logo"/>
									<image v-else src="/static/logo.png" class="circle logo"/>
								</div>
							</div>
							<div class="col-7">
								<div class="rows info">
									<h5 class="title">{{user.username}}</h5>
									<p class="intro">{{user.useremail}}</p>
									<p class="intro">积分：{{user.usercoin}}</p>
								</div>
							</div>
						</view>
					</view>
					<view v-else>
						<view class="list-li">
							<view class="rows text-center">
								<navigator class="btn primary bigpadding" url="/pages/user/login"> 登录/注册 </navigator>
							</view>
						</view>
					</view>					
				</view>
				<view class="list-box bg top">
					<view>
						<view class="list-li">
							<navigator url="/pages/user/course" hover-class="none">
								<view class="rows info">
									我的课程
									<span class="pull-right fa fa-angle-right more"></span>
								</view>
							</navigator>
						</view>
						<view class="list-li">
							<navigator url="/pages/user/exam" hover-class="none">
								<view class="rows info">
									我的考场
									<span class="pull-right fa fa-angle-right more"></span>
								</view>
							</navigator>
						</view>
						<view class="list-li">
							<navigator url="/pages/user/certificate" hover-class="none">
								<view class="rows info">
									我的证书
									<span class="pull-right fa fa-angle-right more"></span>
								</view>
							</navigator>
						</view>
						<view class="list-li">
							<navigator url="/pages/user/payfor" hover-class="none">
								<view class="rows info">
									积分充值
									<span class="pull-right fa fa-angle-right more"></span>
								</view>
							</navigator>
						</view>
						<view class="list-li">
							<navigator url="/pages/user/orders" hover-class="none">
								<view class="rows info">
									我的订单
									<span class="pull-right fa fa-angle-right more"></span>
								</view>
							</navigator>
						</view>
						<view class="list-li">
							<navigator url="/pages/user/modifypass" hover-class="none">
								<view class="rows info">
									修改密码
									<span class="pull-right fa fa-angle-right more"></span>
								</view>
							</navigator>
						</view>
					</view>
				</view>
				<view class="list-box top" v-if="user">
					<view class="list-li">
						<view><button class="btn danger block" @click="dialogConfirm()">退出登录</button></view>
					</view>
				</view>
			</view>
			<view class="page-footer">
				<navigator class="col-4x menu" hover-class="none" url="/pages/index/index" open-type="redirect">
					<span class="fa fa-house"></span><br />
					首页
				</navigator>
				<navigator class="col-4x menu" hover-class="none" url="/pages/course/index" open-type="redirect">
					<span class="fa fa-play-circle"></span><br />
					课程
				</navigator>
				<navigator class="col-4x menu" hover-class="none" url="/pages/exam/index" open-type="redirect">
					<span class="fa fa-square-pen"></span><br />
					考试
				</navigator>
				<view class="col-4x menu active" hover-class="none">
					<span class="fa fa-user"></span><br />
					我的
				</view>
			</view>
		</view>		
	</view>
	<uni-popup ref="alertDialog" type="dialog">
		<uni-popup-dialog cancelText="取消" confirmText="确定" title="退出登录" content="确定要退出登录吗？" @confirm="logout()"></uni-popup-dialog>
	</uni-popup>
</template>
<script setup>
	import ajax from '../../assets/js/ajax';
	import { ref, reactive } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import config from '../../assets/js/config';
	const user = ref();
	const alertDialog = ref(null);
	onLoad( async () => {
		const data = await ajax({
			route:'user-phone'
		});
		if(data)user.value = data.data._user;
	});
	const backForward = () => {
		uni.navigateBack();
	}
	const dialogConfirm = (item) => {
		if(alertDialog.value){
			alertDialog.value.open();
		}
	}
	const logout = async () => {
		const data = await ajax({
			route:'user-phone-logout'
		});
		uni.redirectTo({
			url:'/pages/index/index'
		})
	}
</script>
<style>
	.logobox{
		margin-top: 20upx;
		margin-bottom: 15upx;
	}
	.logo{
		width: 160upx;
		height: 160upx;
	}
</style>