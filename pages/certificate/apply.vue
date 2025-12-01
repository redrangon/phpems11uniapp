<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward"><span class="fa fa-chevron-left"></span></view>
				<view class="col-8">{{ce && ce.cetitle}}</view>
				<view class="col-1"><span class="fa fa-menu"></span></view>
			</view>
			<view class="page-content header footer">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content footer">
			<!--#endif-->
				<view class="list-box bg" v-if="current === 1">
					<view class="list-li">
						<view class="col-4x">
							<view>姓名</view>
						</view>
						<view class="col-4l">
							<input type="text" style="background-color: white;" v-model="user.usertruename" placeholder="请填写真实姓名"/>
						</view>
					</view>
					<view class="list-li">
						<view class="col-4x">
							<view>身份证号</view>
						</view>
						<view class="col-4l">
							<input type="text" maxlength="18" style="background-color: white;" v-model="user.normal_sfz" placeholder="请填写身份证号"/>
						</view>
					</view>
					<view class="list-li">
						<view class="col-4x">
							<view>手机号码</view>
						</view>
						<view class="col-4l">
							<input type="number" maxlength="11" v-model="user.userphone" style="background-color: white;" placeholder="请填写手机号码"/>
						</view>
					</view>
					<view class="list-li">
						<view class="col-4x">
							<view>地址</view>
						</view>
						<view class="col-4l">
							<input type="text" v-model="user.useraddress" style="background-color: white;" placeholder="请填写地址"/>
						</view>
					</view>
					<view class="list-li">
						<button class="btn primary block" @click="submitfrom()">提交申请</button>
					</view>
				</view>
				<view class="list-box bg" v-if="current === 2">
					<view class="list-li">
						<h4 class="title">申请须知</h4>
						<view>
							<span v-html="ce.cetext"></span>
						</view>
					</view>
				</view>
			</view>
			<view class="page-footer">
				<view class="col-5 text-center menu" @click="onClickItem(1)" :style="{color:current == 1?'#2979ff':''}">
					<span class="fa fa-play-circle"></span><br />申请证书
				</view>
				<view class="col-5 text-center menu" @click="onClickItem(2)" :style="{color:current == 2?'#2979ff':''}">
					<span class="fa fa-compass"></span><br />申请须知
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
	import ajax from '../../assets/js/ajax';
	import { ref, reactive } from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import config from '../../assets/js/config';
	const ceid = ref();
	const ce = ref();
	const apply = ref();
	const current = ref(1);
	const user = ref({});
	onLoad( async (e)=>{
		ceid.value = e.ceid
		const data = await ajax({
			route:'certificate-phone-certificate-apply',
			ceid:ceid.value,
		});
		user.value = data.data._user
		ce.value = data.data.ce
	})
	const submitfrom = async () => {
		const data = await ajax({
			route:'certificate-phone-certificate-apply',
			ceid:ceid.value,
			apply:1,
			'args[usertruename]':user.value.usertruename,
			'args[userpassport]':user.value.userpassport,
			'args[userphone]':user.value.userphone,
			'args[useraddress]':user.value.useraddress
		});
		if(data.statusCode == 200){
			uni.showToast({
				title:data.message,
				icon:'none'
			})
			setTimeout(()=>{
				backForward();
			},1000)
		}else{
			uni.showToast({
				title:data.message,
				icon:'none'
			})
		}
		
	}
	const onClickItem = (tag) => {
		current.value = tag
	}
	
	const backForward = () => {
		uni.navigateBack();
	}
</script>