<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-10">课程</view>
			</view>
			<view class="page-content header footer">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content footer">
			<!--#endif-->
				<view v-for="(cat,index,key) in cats" :key="index" :class="key >= 1 ? 'list-box top bg' : 'list-box bg'">
					<view>
						<view class="list-li">
							<view class="bigtitle">{{cat.catname}}
							<navigator :url="'/pages/course/category?catid=' + cat.catid" class="pull-right" hover-class="none">
							<span class="pull-right fa fa-angle-right"></span>
							</navigator>
							</view>
						</view>
						<view class="list-li" v-for="(course,cid) in courses[cat.catid].data" :key="cid">
							<navigator :url="'/pages/course/course?csid=' + course.csid" hover-class="none">
							<view class="col-4x">
								<view class="rows illus">
									<image :src="config.host + course.csthumb" mode="widthFix" class="thumb"/>
								</view>
							</view>
							<view class="col-4l">
								<view class="rows info">
									<h5 class="title">{{course.cstitle}}</h5>
									<p class="intro">{{course.csdescribe.slice(0,30)}}</p>
								</view>
							</view>
							</navigator>
						</view>
					</view>
				</view>
			</view>
			<view class="page-footer">
				<navigator class="col-4x menu" hover-class="none" url="/pages/index/index" open-type="redirect">
					<span class="fa fa-house"></span><br />
					首页
				</navigator>
				<view class="col-4x menu active" hover-class="none">
					<span class="fa fa-play-circle"></span><br />
					课程
				</view>
				<navigator class="col-4x menu" hover-class="none" url="/pages/exam/index" open-type="redirect">
					<span class="fa fa-square-pen"></span><br />
					考试
				</navigator>
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
	const courses = ref();
	const cats = ref();
	onLoad( async () => {
		const data = await ajax({
			route:'course-phone-index-lists'
		});
		if(!data)return;
		cats.value = data.data?.catids;
		courses.value = data.data?.contents;
	});
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