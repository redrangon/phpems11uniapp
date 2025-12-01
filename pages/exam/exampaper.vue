<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward"><span class="fa fa-chevron-left"></span></view>
				<view class="col-8">模拟考试</view>
				<view class="col-1"><span class="fa fa-menu"></span></view>
			</view>
			<view class="page-content header">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content">
			<!--#endif-->
				<scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="lower" lower-threshold="50">
					<view class="list-box bg">
						<view>
							<view class="list-li" v-for="(exam,index) in exams" :key="index">
								<view class="rows info" @click="selectquestions(exam.examid)">
									<view class="title">{{exam.exam}}<span class="fa fa-angle-right pull-right more"></span></view>
									<view class="col-3x intro more">总分：{{exam.examsetting.score}}分</view>
									<view class="col-3x intro more">及格分：{{exam.examsetting.passscore}}分</view>
									<view class="col-3x intro more">限时：{{exam.examsetting.examtime}}分钟</view>
								</view>
							</view>
						</view>
					</view>
					<view class="text-center" style="line-height: 100upx;">{{loadmore}}</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>
<script setup>
	import ajax from '../../assets/js/ajax';
	import { ref, reactive } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import config from '../../assets/js/config';
	const exams = ref([]);
	const current = ref(1);
	const total = ref(0);
	const pageSize = ref(20);
	const loadmore = ref('上滑加载更多');
	onLoad( async () => {
		await getData();
	});	
	const getData = async() => {
		const data = await ajax({
			route:'exam-phone-exampaper',
			number:pageSize.value,
			page:current.value
		});
		total.value = data.data.exams.number;
		exams.value = [...exams.value,...data.data.exams.data];
		if(pageSize.value >= data.data.exams.number){
			loadmore.value = '';
		}
	}
	const lower = () => {
		loadmore.value = '加载中...';
		if(current.value < total.value/pageSize.value){
			current.value = current.value + 1;
			setTimeout(() => {
				getData();
				loadmore.value = '上滑加载更多';
			},300);
		}else{
			loadmore.value = '没有更多数据了';
		}
	}
	const selectquestions = async (examid) => {
		const data = await ajax({
			route:'exam-phone-exampaper-selectquestions',
			examid:examid
		});	
		if(data.statusCode == 200){
			uni.navigateTo({
				url:'/pages/exam/paper?sessionid='+data.sessionid+'&token='+data.token
			})
		}else{
			uni.showToast({
				title:data.message,
				icon:'none'
			})
		}
	}
	const datetime = (time,type=false) => {
		time = parseInt(time);
		let t = new Date(time * 1000);
		let ymd = t.getFullYear() + '-' + (t.getMonth()+1).toString() + '-' + t.getDate();
		let his = t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds();
		if(type == 'ymd'){
			return ymd
		}else{
			return ymd + ' ' + his
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