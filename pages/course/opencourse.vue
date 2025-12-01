<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward">
					<span class="fa fa-chevron-left"></span>
				</view>
				<view class="col-8">开通课程</view>
				<view class="col-1"><span class="fa fa-menu"></span></view>
			</view>
			<view class="page-content header">
			<!--#endif-->	
			<!--#ifdef MP-->
			<view class="page-content">
			<!--#endif-->
				<view class="list-box bg" v-if="detail">
					<view>
						<view class="list-li">
							<view class="col-4x">
								<view class="rows illus">
									<image :src="config.host + detail.csthumb" mode="widthFix" class="thumb"/>
								</view>
							</view>
							<view class="col-4l">
								<view class="rows info">
									<h5 class="title">{{detail.cstitle}}</h5>
									<p class="intro">{{detail.csdescribe}}</p>
								</view>
							</view>
						</view>
						<view v-if="isopen">
							<view class="list-li">
								<navigator :url="'/pages/course/course?csid=' + detail.csid" hover-class="none">
									<button type="primary">开始学习</button>
								</navigator>
							</view>
						</view>
						<view v-else>
							<view v-if="detail.csdemo == 1">
								<view class="list-li">
									本课程是免费课程，可免费开通学习。
								</view>
								<view class="list-li">
									<button type="primary" @click="dialogConfirm()">免费开通</button>
								</view>
							</view>
							<view v-else>
								<view v-if="prices">
									<view class="list-li" v-for="(item,index) in prices" :key="index">
										<view class="rows info" @click="dialogToggle(index)">
											{{item.price}}积分兑换{{item.time}}天
											<span class="pull-right"><em class="fa fa-chevron-right iconmenu"></em></span>
										</view>
									</view>
								</view>
								<view v-else>
									<view class="list-li">
										<button type="warn">请管理员设置课程价格</button>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="alertDialog" type="dialog" v-if="prices">
			<uni-popup-dialog cancelText="取消" confirmText="开通" title="开通课程" :content="'确定要使用'+prices[opentype].price+'积分开通'+prices[opentype].time+'天本课程吗？'" @confirm="dialogConfirm()"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>
<script setup>
	import ajax from '../../assets/js/ajax';
	import { ref, reactive } from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import config from '../../assets/js/config';
	const detail = ref();
	const csid = ref();
	const prices = ref();
	const isopen = ref();
	const opentype = ref(0);
	const alertDialog = ref(null);
	onShow( async () => {
		await getData();
	});
	onLoad( async (e)=>{
		csid.value = e.csid
		await getData();
	})
	const backForward = () => {
		uni.navigateBack();
	}
	const getData = async () => {
		const data = await ajax({
			route:'course-phone-course-opencourse',
			csid:csid.value
		});
		detail.value = data.data.course;
		prices.value = data.data.price;
		isopen.value = data.data.isopen; 
	}
	const dialogToggle = (item) => {
		console.log(item,alertDialog.value);
		opentype.value = item
		if(alertDialog.value){
			alertDialog.value.open();
		}
	}
	const dialogConfirm = async () => {
		const data = await ajax({
			route:'course-phone-course-opencourse',
			csid:csid.value,
			opencs:1,
			opentype:opentype.value??''
		});		
		if(data.statusCode == 200){
			uni.navigateTo({
				url:'/pages/course/course?csid='+csid.value
			})
		}
	}
</script>
