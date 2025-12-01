<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward"><span class="fa fa-chevron-left"></span></view>
				<view class="col-8">成绩单</view>
				<view class="col-1"></view>
			</view>
			<view class="page-content header">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content">
			<!--#endif-->
				<view class="list-box bg" v-if="s">
					<view>
						<view class="list-li">
							<view class="col-5 text-center">您的最高分：{{s.score}}</view>
							<view class="col-5 text-center">您的最好名次：{{s.index}}</view>
						</view>
					</view>
				</view>
				<scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="lower" lower-threshold="50">
				<view class="list-box bg top">
					<view>
						<view class="list-li" v-for="(score,index) in scores" :key="index">
							<view class="col-2 text-center"><h5 style="font-size: 40upx;">{{index + 1}}</h5>名</view>
							<view class="col-8">
								<h5 class="title">{{score.username}}</h5>
								<view class="col-5">{{score.ehstarttime}}</view>
								<view class="col-5 text-right">{{score.ehscore}}分</view>
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
	const scores = ref([]);
	const s = ref();
	const current = ref(1);
	const total = ref(0);
	const pageSize = ref(20);
	const loadmore = ref('上滑加载更多');
	onLoad( async () => {
		await getData();
	});	
	const getData = async() => {
		const data = await ajax({
			route:'exam-phone-score',
			number:pageSize.value,
			page:current.value
		});
		total.value = data.data.scores.number;
		s.value = data.data.s;
		scores.value = [...scores.value,...data.data.scores.data];
		if(pageSize.value >= data.data.scores.number){
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