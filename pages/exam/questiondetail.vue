<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward"><span class="fa fa-chevron-left"></span></view>
				<view class="col-8">试题详情</view>
				<view class="col-1"></view>
			</view>
			<view class="page-content header">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content">
			<!--#endif-->
				<view class="list-box bg" v-if="question">
					<view>
						<view class="list-li">
							<span v-html="question.question"></span>
						</view>
						<view class="list-li">
							<span v-html="question.questionselect"></span>
						</view>
						<view class="list-li">
							<view class="intro">
								<span class="badge primary" style="margin-right:10rpx;border-radius: 30rpx;">正确答案</span><span class="text-danger" v-html="question.questionanswer"></span>
							</view>
						</view>
						<view class="list-li">
							<view class="intro">
								<span class="badge" style="margin-right:10rpx;border-radius: 30rpx;">试题解析</span>
								<span v-html="question.questiondescribe"></span>
							</view>
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
	const questionid = ref();
	const question = ref();
	onLoad( async (e)=>{
		questionid.value = e.questionid
		await getData();
	})
	const getData = async () => {
		const data = await ajax({
			route:'exam-phone-questions-detail',
			questionid:questionid.value
		});
		question.value = data.data.question;
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