<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward"><span class="fa fa-chevron-left"></span></view>
				<view class="col-8">考试记录</view>
				<view class="col-1"><span class="fa fa-menu"></span></view>
			</view>
			<view class="page-content header">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content">
			<!--#endif-->
				<scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="lower" lower-threshold="50">
					<view class="list-box">
						<uni-segmented-control :current="ehtype" :values="items" style-type="button" active-color="#2979ff" @clickItem="onClickItem" />
					</view>
					<view class="list-box top bg">
						<view>
							<view class="list-li" v-for="(exam,index) in exams" :key="index">
								<navigator :url="'/pages/exam/history_stats?ehid=' + exam.ehid">
									<view class="col-2 text-center">
										<view v-if="exam.ehstatus == 0 && exam.ehdecide != 0"><h5 style="font-size: 40upx;">?</h5>分</view>
										<view v-else><h5 style="font-size: 40upx;"><span :style="{'color':exam.ehispass == 1?'#3c763d':'#a94442'}">{{Math.floor(exam.ehscore)}}</span></h5>分</view>
									</view>
									<view class="col-8 rows info">
										<view class="title">{{exam.ehexam}}<span class="fa fa-angle-right more pull-right"></span></view>
										<view class="col-3x more">{{datetime(exam.ehstarttime,'ymd')}}</view>
										<view class="col-3x more text-center">用时：
											<span v-if="exam.ehtime >= 60">
												<span v-if="exam.ehtime % 60">{{Math.floor(exam.ehtime / 60) + 1}}</span>
												<span v-else>{{exam.ehtime / 60}}</span>分
											</span>
											<span v-else>{{exam.ehtime}}秒</span>
										</view>
										<view class="col-3x more text-center"><span v-if="exam.ehtype == 0">强化训练</span><span v-if="exam.ehtype == 1">模拟考试</span><span v-if="exam.ehtype == 2">正式考试</span></view>
									</view>
								</navigator>
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
	const ehtype = ref(0);
	const current = ref(1);
	const total = ref(0);
	const pageSize = ref(20);
	const loadmore = ref('上滑加载更多');
	const items = ref(['强化训练', '模拟考试', '正式考试'])
	onLoad( async () => {
		await getData();
	});	
	const getData = async() => {
		const data = await ajax({
			route:'exam-phone-history-history',
			number:pageSize.value,
			page:current.value,
			ehtype:ehtype.value
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
	const onClickItem = (e) => {
		if (ehtype.value !== e.currentIndex) {
			ehtype.value = e.currentIndex
			exams.value = ''
			current.value = 1;
			total.value = 0;
			pageSize.value = 20;
			getData();
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