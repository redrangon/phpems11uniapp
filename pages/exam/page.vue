<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward"><span class="fa fa-chevron-left"></span></view>
				<view class="col-8" v-if="basic">{{basic.basic.slice(0,15)}}</view>
				<view class="col-1"><span class="fa fa-menu"></span></view>
			</view>
			<view class="page-content header">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content">
			<!--#endif-->
				<view class="list-box bg">
					<view>
						<view class="list-li">
							<navigator url="/pages/exam/lesson" hover-class="none">
								<view class="col-4x text-center">
									<span class="fa fa-marker examicon"></span>
								</view>
								<view class="col-4l">
									<h5 class="title">课后练习</h5>
									<p class="more">逐个章节、知识点刷题练习</p>
								</view>
							</navigator>
						</view>
						<view class="list-li">
							<navigator url="/pages/exam/recite" hover-class="none">
								<view class="col-4x text-center">
									<span class="fa fa-bell examicon"></span>
								</view>
								<view class="col-4l">
									<h5 class="title">背题模式</h5>
									<p class="more">逐个章节、知识点逐题背诵</p>
								</view>
							</navigator>
						</view>
						<view class="list-li">
							<navigator url="/pages/exam/exercise" hover-class="none">
								<view class="col-4x text-center">
									<span class="fa fa-pen-ruler examicon"></span>
								</view>
								<view class="col-4l">
									<h5 class="title">强化训练</h5>
									<p class="more">选择考试范围、题型、数量组卷练习</p>
								</view>
							</navigator>
						</view>
						<view class="list-li">
							<navigator url="/pages/exam/exampaper" hover-class="none">
								<view class="col-4x text-center">
									<span class="fa fa-laptop-file examicon"></span>
								</view>
								<view class="col-4l">
									<h5 class="title">模拟考试</h5>
									<p class="more">仿真模拟考试，体验真实考试环境</p>
								</view>
							</navigator>
						</view>
						<view class="list-li">
							<navigator url="/pages/exam/history" hover-class="none">
								<view class="col-4x text-center">
									<span class="fa fa-record-vinyl examicon"></span>
								</view>
								<view class="col-4l">
									<h5 class="title">考试记录</h5>
									<p class="more">强化训练、模拟和正式考试记录</p>
								</view>
							</navigator>
						</view>
						<view class="list-li">
							<navigator url="/pages/exam/favor" hover-class="none">
								<view class="col-4x text-center">
									<span class="fa fa-flag examicon"></span>
								</view>
								<view class="col-4l">
									<h5 class="title">收藏</h5>
									<p class="more">试题收藏 便捷背题</p>
								</view>
							</navigator>
						</view>
						<view class="list-li">
							<navigator url="/pages/exam/record" hover-class="none">
								<view class="col-4x text-center">
									<span class="fa fa-bug examicon"></span>
								</view>
								<view class="col-4l">
									<h5 class="title">错题</h5>
									<p class="more">错题练习 随机检测</p>
								</view>
							</navigator>
						</view>
						<view class="list-li">
							<navigator url="/pages/exam/score" hover-class="none">
								<view class="col-4x text-center">
									<span class="fa fa-chart-line examicon"></span>
								</view>
								<view class="col-4l">
									<h5 class="title">成绩单</h5>
									<p class="more">本考场所有学员分数及排名</p>
								</view>
							</navigator>
						</view>
						<view class="list-li">
							<navigator url="/pages/exam/question" hover-class="none">
								<view class="col-4x text-center">
									<span class="fa fa-map-location examicon"></span>
								</view>
								<view class="col-4l">
									<h5 class="title">试题搜索</h5>
									<p class="more">试题搜索</p>
								</view>
							</navigator>
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
	const basic = ref();
	onLoad( async ()=>{
		await getData();
	})
	const getData = async () => {
		const data = await ajax({
			route:'exam-phone-basics-page'
		});
		basic.value = data.data.data.currentbasic;
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
	.examicon{
		color: #2979ff;
	}
</style>