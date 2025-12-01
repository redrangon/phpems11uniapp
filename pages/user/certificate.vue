<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward">
					<span class="fa fa-chevron-left"></span>
				</view>
				<view class="col-8">我的证书</view>
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
						<view class="list-li" v-for="(item,index) in certificates" :key="index">
							<navigator :url="'/pages/user/cedetail?ceqid=' + item.ceqid">
							<view class="col-4x">
								<view class="rows illus">
									<image :src="config.host + item.cethumb" mode="widthFix" class="thumb"/>
								</view>
							</view>
							<view class="col-4l">
								<view class="rows info">
									<h5 class="title">{{item.cetitle}}</h5>
									<p class="intro">{{status[item.ceqstatus]}}<span class="more">（{{datetime(item.ceqtime,'ymd')}}）</span></p>
								</view>
							</view>
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
	const certificates = ref([]);
	const status = ref();
	const current = ref(1);
	const total = ref(0);
	const pageSize = ref(20);
	const loadmore = ref('上滑加载更多');
	onLoad( async () => {
		await getData();
	});	
	const getData = async() => {
		const data = await ajax({
			route:'user-phone-certificate',
			number:pageSize.value,
			page:current.value
		});
		status.value = data.data.status;
		total.value = data.data.certificates.number;
		certificates.value = [...certificates.value,...Object.values(data.data.certificates.data)];
		if(pageSize.value >= data.data.certificates.number){
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
