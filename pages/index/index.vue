<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-10">PHPEMS模拟考试系统</view>
			</view>
			<view class="page-content header footer">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content footer">
			<!--#endif-->
				<view class="uni-margin-wrap">
					<swiper class="swiper" circular>
						<swiper-item v-for="(item,index) in topimg" :key="index">
							<view class="swiper-item uni-bg-red">
								<navigator :url="'/pages/content/content?contentid='+item.pccontentid" hover-class="none">
									<image :src="item.pcthumb" mode="aspectFill" style="width: 100%;" class="topimg"></image>
								</navigator>
							</view>
						</swiper-item>
					</swiper>
				</view>
				<view class="list-box bg top padding" style="overflow:hidden;">
					<view>
						<view class="col-4x text-center">
							<navigator url="/pages/content/index" class="rows" hover-class="none">
								<image src="@/assets/images/ico1.png" class="ico"/>
								<br />
								<span class="intro">新闻</span>
							</navigator>
						</view>
						<view class="col-4x text-center">
							<navigator url="/pages/course/index" open-type="redirect" class="rows" hover-class="none">
								<image src="@/assets/images/ico2.png" class="ico"/>
								<br />
								<span class="intro">课程</span>
							</navigator>
						</view>
						<view class="col-4x text-center">
							<navigator url="/pages/exam/index" open-type="redirect" class="rows" hover-class="none">
								<image src="@/assets/images/ico3.png" class="ico"/>
								<br />
								<span class="intro">考试</span>
							</navigator>
						</view>
						<view class="col-4x text-center">
							<navigator url="/pages/certificate/index" class="rows" hover-class="none">
								<image src="@/assets/images/ico4.png" class="ico"/>
								<br />
								<span class="intro">证书</span>
							</navigator>
						</view>
					</view>
				</view>
				<view class="list-box bg top">
					<view>
						<view class="list-li bigtitle">通知公告</view>
						<view class="list-li" v-for="(notice,index) in notices" :key="index">
							<view class="rows">
								<navigator :url="'/pages/content/content?contentid='+notice.contentid" hover-class="none">
									<view class="intro">
										{{notice.contenttitle.slice(0,16)}}
										<span class="pull-right more">{{datetime(notice.contentinputtime,'ymd')}}</span>
									</view>
								</navigator>
							</view>
						</view>
					</view>
				</view>
				<view class="list-box bg top">
					<view>
						<view class="list-li bigtitle">热点新闻</view>
						<view class="list-li" v-for="(hotnew,index) in hotnews" :key="index">
							<view class="rows">
								<navigator :url="'/pages/content/content?contentid='+hotnew.pccontentid" hover-class="none">
									<view class="intro">
										{{hotnew.pctitle.slice(0,16)}}
									</view>
								</navigator>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="page-footer">
				<view class="col-4x menu active" hover-class="none">
					<span class="fa fa-house"></span><br />
					首页
				</view>
				<navigator class="col-4x menu" hover-class="none" url="/pages/course/index" open-type="redirect">
					<span class="fa fa-play-circle"></span><br />
					课程
				</navigator>
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
	const notices = ref();
	const hotnews = ref();
	const topimg = ref({});
	onLoad(async () => {
		const data = await ajax({
			route:'core-app'
		});
		if(!data)return;
		notices.value = data.data.notices.data;
		hotnews.value = data.data.topnews.data;
		const imgs = data.data.topimgs.data;
		for(let x in imgs){
			imgs[x].pcthumb = config.host+imgs[x].pcthumb
		}
		topimg.value = imgs;
	});	
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
</script>

<style>
	.ico{
		width: 100upx;
		height: 100upx;
	}
	.swiper{
		height:360upx;
	}
	.topimg{
		height: 360upx;
		border-radius: 20upx;
	}
</style>
