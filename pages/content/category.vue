<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward">
					<span class="fa fa-chevron-left"></span>
				</view>
				<view class="col-8">{{cat}}</view>
				<view class="col-1"><span class="fa fa-menu"></span></view>
			</view>
			<view class="page-content header">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content">
			<!--#endif-->
				<scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="lower" lower-threshold="50">
				<view class="list-box bg">
					<view>
						<view class="list-li" v-for="(content,index) in contents" :key="index">
							<view class="rows">
								<navigator :url="'/pages/content/content?contentid=' + content.contentid" hover-class="none">
									<view class="intro">
										{{content.contenttitle.slice(0,16)}}
										<span class="pull-right more">{{datetime(content.contentinputtime,'ymd')}}</span>
									</view>
								</navigator>
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
	const contents = ref([]);
	const cat = ref();
	const catid = ref();
	const current = ref(1);
	const total = ref(0);
	const pageSize = ref(20);
	const loadmore = ref('上滑加载更多');
	onLoad( async (e) => {
		catid.value = e.catid
		await getData();
	});	
	const getData = async() => {
		const data = await ajax({
			route:'content-app-category',
			catid:catid.value,
			number:pageSize.value,
			page:current.value
		});
		total.value = data.data.contents.number;
		cat.value = data.data.cat.catname;
		contents.value = [...contents.value,...data.data.contents.data];
		if(pageSize.value >= data.data.contents.number){
			loadmore.value = '';
		}
		<!--#ifdef MP-->
		uni.setNavigationBarTitle({
			title: data.data.cat.catname
		});
		<!--#endif-->
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
