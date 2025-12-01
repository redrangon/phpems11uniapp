<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-2" @tap="backForward"><view class="col-5"><span class="fa fa-chevron-left"></span></view></view>
				<view class="col-6">普通试题</view>
				<view class="col-2"></view>
			</view>
			<view class="page-content header">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content">
			<!--#endif-->
				<view class="list-box">
					<uni-segmented-control :current="0" :values="items" style-type="button" active-color="#2979ff" @clickItem="onClickItem" />
				</view>
				<scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="lower" lower-threshold="50">
				<view class="list-box top">
					<view class="col-8"><input type="text" class="searchinput" name="keyword" v-model="keyword" confirm-type="search" placeholder="请输入关键词" /></view>
					<view class="col-2 text-right"><button class="btn primary searchbtn" @click="questionsearch()">搜索</button></view>
					<view class="clear"></view>
				</view>
				<view class="list-box bg top">
					<view>
						<view class="list-li" v-for="(question,index) in questions" :key="index">
							<navigator :url="'/pages/exam/questiondetail?questionid=' + question.questionid" hover-class="none">
								<view v-html="question.question"></view>
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
	const questions = ref([]);
	const keyword = ref();
	const current = ref(1);
	const total = ref(0);
	const pageSize = ref(20);
	const loadmore = ref('上滑加载更多');
	const items = ref(['普通试题', '题冒题'])
	onLoad( async () => {
		await getData();
	});	
	const getData = async() => {
		const data = await ajax({
			route:'exam-phone-questions-questions',
			number:pageSize.value,
			page:current.value,
			'search[keyword]':keyword.value??''
		});
		total.value = data.data.questions.number;
		questions.value = [...questions.value,...data.data.questions.data];
		if(pageSize.value >= data.data.questions.number){
			loadmore.value = '';
		}
	}
	const questionsearch = () => {
		questions.value = [];
		current.value = 1;
		getData();
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
	const onClickItem = (e) => {
		if (e.currentIndex == 1) {
			uni.redirectTo({
				url:'/pages/exam/questionrows'
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
	.searchinput{
		border: solid 1px #efefef;
		background-color: #FFFFFF;
		border-radius: 50upx;
		padding:0 30upx;
	}
	.searchbtn{
		padding:15upx 30upx;
		border-radius: 50upx;
	}
</style>