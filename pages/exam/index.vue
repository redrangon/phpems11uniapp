<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-10">考试</view>
			</view>
			<view class="page-content header footer">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content footer">
			<!--#endif-->
				<scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="lower" lower-threshold="50">
				<view class="list-box bg">
					<view>
						<view class="list-li" v-for="(basic,index) in basics" :key="index">
							<navigator :url="'/pages/exam/detail?basicid=' + basic.basicid">
							<view class="col-4x">
								<view class="rows illus">
									<image :src="config.host + basic.basicthumb" mode="widthFix" class="thumb"/>
									<span class="rows badge" v-if="basic.isopen">已开通</span>
								</view>
							</view>
							<view class="col-4l">
								<view class="rows info">
									<h5 class="title">{{basic.basic}}</h5>
									<p class="intro more">{{basic.basicdescribe.slice(0,30)}}</p>
								</view>
							</view>
							</navigator>
						</view>
					</view>
				</view>
				<view class="text-center" style="line-height: 100upx;">{{loadmore}}</view>
				</scroll-view>
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
				<view class="col-4x menu active" hover-class="none">
					<span class="fa fa-square-pen"></span><br />
					考试
				</view>
				<navigator class="col-4x menu" hover-class="none" url="/pages/user/index" open-type="redirect">
					<span class="fa fa-user"></span><br />
					我的
				</navigator>
			</view>
		</view>
	</view>
</template>
<script setup>
	import ajax from '../../assets/js/ajax';
	import { ref, reactive } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import config from '../../assets/js/config';
	const basics = ref([]);
	const openbasics = ref();
	const current = ref(1);
	const total = ref(0);
	const pageSize = ref(20);
	const loadmore = ref('上滑加载更多');
	onLoad( async (e) => {
		await getData();
	});	
	const getData = async() => {
		const data = await ajax({
			route:'exam-phone-basics',
			number:pageSize.value,
			page:current.value
		});
		total.value = data.data.basics.number;
		openbasics.value = data.data.data.openbasics;
		basics.value = [...basics.value,...Object.values(data.data.basics.data)];
		if(pageSize.value >= data.data.basics.number){
			loadmore.value = '';
		}
		let time = Math.floor(Date.now() / 1000);
		for(let x in basics.value){
			if(openbasics.value[basics.value[x].basicid] && openbasics.value[basics.value[x].basicid].obendtime > time){
				basics.value[x].isopen = 1
			}else{
				basics.value[x].isopen = 0
			}
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