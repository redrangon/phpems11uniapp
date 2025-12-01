<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-2" @tap="backForward"><view class="col-5"><span class="fa fa-chevron-left"></span></view></view>
				<view class="col-6">组卷练习</view>
				<view class="col-2"></view>
			</view>
			<view class="page-content header footer">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content footer">
			<!--#endif-->
				<view class="list-box">
					<uni-segmented-control :current="1" :values="items" style-type="button" active-color="#2979ff" @clickItem="onClickItem" />
				</view>
				<view class="list-box top bg">
					<view>
						<view class="list-li">
							<view class="col-3x">试卷名称：</view>
							<view class="col-3l">
								<view class="uni-form-item uni-column">
									<input @input="dataChange($event,'title')" class="uni-input" maxlength="12" placeholder="请输入试卷名称" />
								</view>
							</view>
						</view>
						<view class="list-li">
							<view class="col-3x">时间（分钟）：</view>
							<view class="col-3l">
								<view class="uni-form-item uni-column">
									<input class="uni-input" @input="dataChange($event,'time')" value="60" maxlength="3" placeholder="请输入答题时间(数字)" />
								</view>
							</view>
						</view>
						<template v-for="(quest,index) in questype" :key="index">
						<view class="list-li" v-if="quest.number > 0">
							<view class="col-6">{{quest.questype}}（共{{quest.number}}题），选</view>
							<view class="col-3">
								<view class="uni-form-item uni-column">
									<input class="uni-input" @input="datanumberChange($event,quest.questid)" maxlength="3" placeholder="0" />
								</view>
							</view>
							<view class="col-1">题</view>
						</view>
						</template>
						<view class="list-li">
							<button class="btn primary block" @click="formSubmit()">配题完毕，开始测试</button>
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
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import config from '../../assets/js/config';
	const datas = ref({'title':'','time':60,'number':{}});
	const questype = ref();
	const numbers = ref();
	const popup = ref(null);
	const items = ref(['逐题练习', '组卷练习'])
	onLoad( async ()=>{
		await getData();
	})
	const getData = async () => {
		const data = await ajax({
			route:'exam-phone-record-papers'
		});
		questype.value = data.data.questype;
	}
	const dataChange = (e,name) => {
		datas.value[name] = e.detail.value;
	}
	const datanumberChange = (e,name) => {
		datas.value.number[name] = e.detail.value;
	}
	const formSubmit = async () => {
		const data = await ajax({
			route:'exam-phone-record-selectquestions',
			setExecriseConfig:1,
			args:JSON.stringify(datas.value)
		})
		if(data.statusCode == 200){
			uni.navigateTo({
				url:'/pages/exam/exercise_paper?sessionid=' + data.sessionid + '&token=' + data.token
			})
		}else{
			uni.showToast({
				title:res.data.message,
				icon:'none'
			})
		}
	}
	const openSelect = () => {
		if(popup.value){
			popup.value.open();
		}
	}	
	const onClickItem = (e) => {
		if (e.currentIndex == 0) {
			uni.redirectTo({
				url:'/pages/exam/record'
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