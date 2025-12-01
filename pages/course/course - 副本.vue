<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward">
					<span class="fa fa-chevron-left"></span>
				</view>
				<view class="col-8">{{video && video.coursetitle}}</view>
				<view class="col-1"><span class="fa fa-menu"></span></view>
			</view>
			<view class="page-content header" v-if="video">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content" v-if="video">
			<!--#endif-->
				<view>
					<video :src="videourl(video.course_files)" :controls="detail.csprogress == 1?'false':'true'" :title="video.coursetitle" :poster="video.coursethumb" @timeupdate = "videotime" :initial-time="logs[video.courseid].logprogress" @ended = "videoend" style="width: 750rpx;"></video>
				</view>
				<view class="list-box bg" v-if="ids">
					<view>
						<view class="list-li">
							<h4 class="bigtitle">课件列表</h4>
						</view>
						<view>
							<courseTree :data="treeData" @current-change="handleNodeClick"></courseTree>
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
	import { onLoad } from '@dcloudio/uni-app'
	import config from '../../assets/js/config';
	import courseTree from '../../components/course/courseTree.vue';
	const modules = ref();
	const ids = ref();
	const logs = ref();
	const detail = ref();
	const videos = ref();
	const video = ref();
	const videoid = ref();
	const csid = ref();
	const treeData = ref([{
		course:1,
		coursetitle:'test1',
		children:[
			{
				course:11,
				coursetitle:'test11',
				children:[
					{
						course:111,
						coursetitle:'test1111',
					},
					{
						course:112,
						coursetitle:'test1112',
					}
				]
			},
			{
				course:21,
				coursetitle:'test21',
				children:[
					{
						course:211,
						coursetitle:'test2111',
					}
				]
			}
		]
	}]);
	
	const handleNodeClick = () => {
		return;
	}
	onLoad( async (e) => {
		videoid.value = e.videoid??'';
		csid.value = e.csid
		const data = await ajax({
			route:'course-phone-course',
			csid:e.csid,
			contentid:videoid.value
		});
		if(data.callbackType){
			uni.redirectTo({
				url:'/pages/course/opencourse?csid='+e.csid
			})
		}else{
			detail.value = data.data.course;
			video.value = data.data.content;
			videos.value = data.data.lessons;
			videoid.value = data.data.content.courseid;
			video.value.coursethumb = config.host + video.value.coursethumb;
			modules.value = data.data.modules;
			ids.value = data.data.ids;
			logs.value = data.data.logs;
			<!--#ifdef MP-->
			uni.setNavigationBarTitle({
				title: data.data.content.coursetitle.slice(0,15)
			});
			<!--#endif-->
		}
	});
	const videotime = async (e) => {
		await uni.request({
			url: config.host + 'index.php',
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				'app-agent':'phpemsapkinterface',
				'cookie':'path=/;' + uni.getStorageSync('cookie')
			},
			method: 'POST',
			withCredentials: true,
			data:{
				userhash:Math.random(),
				route:'course-phone-course-recordtime',
				courseid:videoid.value,
				time:e.detail.currentTime
			}
		})
		// await ajax({
		// 	route:'course-phone-course-recordtime',
		// 	courseid:videoid.value,
		// 	time:e.detail.currentTime
		// });
	}
	const videoend = async () => {
		await ajax({
			route:'course-phone-course-endstatus',
			courseid:videoid.value
		});
	}
	const videourl = (url) => {
		if(url.startsWith("//") || url.startsWith("http://") || url.startsWith("https://")){
			return url;
		}else{
			return config.host + url;
		}
	}
	const backForward = () => {
		uni.navigateBack();
	}
</script>
<style>
	.page-tabs{
		padding:0px;
	}
	.playicon{
		margin-right:10upx;
	}
	.list-box{
		border-radius: 0px;
	}
</style>
