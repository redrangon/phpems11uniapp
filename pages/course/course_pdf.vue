<template>
	<view class="pages">
		<view class="page-tabs">
			<view class="page-content" v-if="video">
				<view class="list-box webview-container">
					<web-view :src="config.host + 'index.php?core-phone-index-pdfview&file=' + video.pdf_file"></web-view>
				</view>
				<view class="list-box bg" v-if="ids">
					<view>
						<view class="list-li">
							<h4 class="bigtitle">课件列表</h4>
						</view>	
						<view class="list-li">
							<courseTree :data="videos" @current-change="handleNodeClick"></courseTree>
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
	import courseTree from '../../components/course/courseTree.vue';
	const modules = ref();
	const ids = ref();
	const logs = ref();
	const detail = ref();
	const videos = ref();
	const video = ref();
	const videoid = ref();
	const csid = ref();
	const time = ref(300);
	const logprogress = ref(0);
	const handleNodeClick = () => {
		return;
	}
	
	const buildTree = (data) => {
		// 将原始对象转换为数组，并为每个节点添加 children
		const items = data;

		// 创建一个以 courseid 为 key 的映射，便于快速查找
		const itemMap = {};
		items.forEach(item => {
			itemMap[item.courseid] = item;
		});

		// 根节点数组
		const roots = [];

		// 遍历所有节点，将其加入父节点的 children 中
		items.forEach(item => {
			if (item.coursedirid === 0) {
				// 根节点
				roots.push(item);
			} else {
				// 找到父节点
				const parent = itemMap[item.coursedirid];
				let thisNode = item;
				if(item.iscurrent)thisNode.expanded = true;
				while(thisNode.expanded)
				{
					let parentNode = itemMap[thisNode.coursedirid];
					if(parentNode?.coursedirid >= 0)
					{
						parentNode.expanded = true;
						thisNode = parentNode;
					}
					else break;
				}
				if (parent) {
					parent.children.push(item);
				} else {
					// 如果父节点不存在（数据异常），也可以选择将其作为根节点或忽略
					roots.push(item);
				}
			}
		});
		return roots;
	}
	onLoad( async (e) => {
		videoid.value = e.videoid??'';
		csid.value = e.csid;
	});
	onShow( async () => {
		await getData();
	});
	const getData = async () => {
		const data = await ajax({
			route:'course-phone-course',
			csid:csid.value,
			contentid:videoid.value
		});
		if(data.callbackType){
			uni.redirectTo({
				url:'/pages/course/opencourse?csid='+csid.value
			})
		}else{
			detail.value = data.data.course;
			video.value = data.data.content;
			videoid.value = data.data.content.courseid;
			video.value.coursethumb = config.host + video.value.coursethumb;
			modules.value = data.data.modules;
			ids.value = data.data.ids;
			logs.value = data.data.logs;
			
			let lessons = data.data.lessons;
			lessons = Object.values(lessons).map(item => ({
				...item,
				iscurrent:item.courseid == data.data.content.courseid,
				module:data.data.modules[item.coursemoduleid].modulecode,
				logstatus:data.data.logs[item.courseid]?.logstatus,
				logprogress:data.data.logs[item.courseid]?.logprogress,
				children: []
			}));
			videos.value = buildTree(lessons);
			
			<!--#ifdef MP-->
			uni.setNavigationBarTitle({
				title: data.data.content.coursetitle.slice(0,15)
			});
			<!--#endif-->
		}
	}
	const runTimer = () => {
		let setlefttime = setInterval(()=>{
			if(time.value <= 0){
				clearInterval(setlefttime)
				videoend();
			}else{
				time.value--;
				logprogress.value++;
				recordtime();
			}
		},1000)
	}
	const recordtime = async () => {
		if(logprogress.value % 19 != 0)return;
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
				time:logprogress.value
			}
		})
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
	.webview-container{
		width: 100%;
		height: 500px; 
	}
</style>
