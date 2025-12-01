<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward">
					<span class="fa fa-chevron-left"></span>
				</view>
				<view class="col-8">重置密码</view>
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
						<view class="list-li">
							<view class="col-3 tip">
								用户名
							</view>
							<view class="col-7">
								<input type="text" v-model="args.username" class="noborder" placeholder="请输入用户名">
							</view>
						</view>
						<view class="list-li">
							<view class="col-3 tip">
								邮箱
							</view>
							<view class="col-7">
								<input type="text" v-model="args.useremail" class="noborder" placeholder="请输入邮箱">
							</view>
						</view>
						<view class="list-li">
							<label class="block">
								<view class="col-3 tip">
									验证码
								</view>
								<view class="col-4">
									<input class="noborder" v-model="randcode" type="text" placeholder="请输入验证码">
								</view>
								<view class="col-3 text-center" @click="sendphonecode()">
									<span>{{codetext}}</span>
								</view>
							</label>
						</view>
						<view class="list-li">
							<view class="col-3 tip">
								新密码
							</view>
							<view class="col-7">
								<input type="text" password v-model="args.userpassword" class="noborder" placeholder="请输入新密码">
							</view>
						</view>
						<view class="list-li">
							<view class="col-3 tip">
								重复密码
							</view>
							<view class="col-7">
								<input type="text" password v-model="args.userpassword2" class="noborder" placeholder="请重复输入密码">
							</view>
						</view>
						<view class="list-li">
							<button class="btn primary block" @click="formSubmit()">重置密码</button>
						</view>
					</view>
				</view>
					<view class="text-center">
						<navigator open-type="navigateBack">返回登录</navigator>
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
	const randcode = ref();
	const args = ref([]);
	const codetext = ref('发送验证码');
	const sendstatus = ref(true);
	const sendtime = ref(0);
	const regmentbox = ref(null);
	onLoad( async () => {
		
	});	
	const formSubmit = async () => {
		if(!args.value.username){
			uni.showToast({
				title:"请填写用户名",
				icon:'none',
				duration:1000
			})
		}else if(!args.value.useremail){
			uni.showToast({
				title:"请填写邮箱",
				icon:'none',
				duration:1000
			})
		}else if(!args.value.userpassword){
			uni.showToast({
				title:"请填写密码",
				icon:'none',
				duration:1000
			})
		}else if(!args.value.userpassword2){
			uni.showToast({
				title:"请再次填写密码",
				icon:'none',
				duration:1000
			})
		}else if(args.value.userpassword != args.value.userpassword2){
			uni.showToast({
				title:"两次密码输入不一致",
				icon:'none',
				duration:1000
			})
		}else{		
			const data = await ajax({
				route:'user-phone-register',
				'args[username]':args.value.username,
				'args[useremail]':args.value.useremail,
				'args[userpassword]':args.value.userpassword,
				'args[userpassword2]':args.value.userpassword2,
				randcode:randcode.value,
				userregister:1
			});
			if(data.statusCode == 200 || data.statusCode == 201){
				uni.showToast({
					title:'注册成功',
					icon:'none'
				})
				setTimeout(()=>{
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
	}
	const sendphonecode = async () => {
		if(!args.value.useremail){
			uni.showToast({
				title:'请输入邮箱',
				icon:'none',
				duration:1000
			})
		}else if(sendstatus.value){
			const data = await ajax({
				route:'core-api-index-sendmail',
				action:'findpassword',
				email:args.value.useremail
			});
			if(data.statusCode == 200){
				uni.showToast({
					title:'验证码发送成功，请登录邮箱查收',
					icon:'none',
					duration:1000
				})
				sendstatus.value = false;
				sendtime.value = 120;
				let timer = setInterval(()=>{
					sendtime.value--;
					codetext.value = sendtime.value + '秒后重发'
					if(sendtime.value < 1){
						clearInterval(timer);
						codetext.value = '重新发送验证码';
						sendstatus.value = true
					}
				},1000)
			}else{
				uni.showToast({
					title:data.message,
					icon:'none',
					duration:1000
				})
			}
		}else{
			uni.showToast({
				title:'请稍后再次发送',
				icon:'none',
				duration:1000
			})
		}
	}
	const backForward = () => {
		uni.navigateBack();
	}
	const mentopen = () => {
		regmentbox.value.open();
	}
	const mentclean = () => {
		regmentbox.value.close();
	}
	const datacheckChange = (e) => {
		regagreement.value = e.detail.value;
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