<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward"><span class="fa fa-chevron-left"></span></view>
				<view class="col-7">我的订单</view>
				<view class="col-2"></view>
			</view>
			<view class="page-content header">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content">
			<!--#endif-->
				<scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="lower" lower-threshold="50">
				<view class="list-box bg top" v-for="(item,index) in orders" :key="index">
					<view>
						<view class="list-li">
							<navigator :url="'/pages/user/orderdetail?ordersn=' + item.ordersn" hover-class="none">
								<view class="col-10">
									<view class="col-4l"><h4 class="bigtitle">{{item.ordersn}}</h4></view>
									<view class="col-4x text-right" style="line-height: 70upx;">{{orderstatus[item.orderstatus]}}</view>
								</view>
								<view class="table">
									<view class="tr">
										<view class="text-left td paddinglr">{{item.ordertitle}}</view>
									</view>
									<view class="tr">
										<view class="col-3x td">充值金额</view>
										<view class="col-3x td">可兑换积分</view>
										<view class="col-3x td">下单时间</view>
									</view>
									<view class="tr">
										<view class="col-3x td">{{item.orderprice}}</view>
										<view class="col-3x td">{{item.orderprice * 10}}</view>
										<view class="col-3x td">{{item.ordercreatetime}}</view>
									</view>
									<view class="tr">
										<view class="text-right td paddinglr">应付款：￥{{item.orderprice}}</view>
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
	const orders = ref([]);
	const orderstatus = ref();
	const current = ref(1);
	const total = ref(0);
	const pageSize = ref(20);
	const loadmore = ref('上滑加载更多');
	onLoad( async () => {
		await getData();
	});	
	const getData = async() => {
		const data = await ajax({
			route:'user-phone-payfor-orders',
			number:pageSize.value,
			page:current.value
		});
		orderstatus.value = data.data.orderstatus;
		total.value = data.data.orders.number;
		orders.value = [...orders.value,...data.data.orders.data];
		if(pageSize.value >= data.data.orders.number){
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
<style>
	.ico{
		width: 100upx;
		height: 100upx;
	}
	.top:first-child{
		margin-top:0px;
	}
</style>