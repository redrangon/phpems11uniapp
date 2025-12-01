<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward"><span class="fa fa-chevron-left"></span></view>
				<view class="col-7">订单详情</view>
				<view class="col-2"></view>
			</view>
			<view class="page-content header">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content">
			<!--#endif-->
				<view class="list-box bg" v-if="order">
					<view>
						<view class="list-li">
							<view><h4 class="bigtitle">订单号：{{order.ordersn}}</h4></view>
						</view>
						<view class="list-li">
							<view class="table">
									<view class="tr paddinglr">{{order.ordertitle}}</view>
									<view class="tr">
										<view class="col-3x td">充值金额</view>
										<view class="col-3x td">可兑换积分</view>
										<view class="col-3x td">下单时间</view>
									</view>
									<view class="tr">
										<view class="col-3x td">{{order.orderprice}}</view>
										<view class="col-3x td">{{order.orderprice * 10}}</view>
										<view class="col-3x td">{{order.ordercreatetime}}</view>
									</view>
									<view class="tr text-right paddinglr">应付款：￥{{order.orderprice}}</view>
							</view>
						</view>
						<view class="list-li" v-if="order.orderstatus == 1">
							<!--#ifdef !MP-->
							<view><button class="btn primary block" @click="alipayfor">支付宝支付</button></view>
							<view class="paddingtb hide"><button class="btn weixin block" @click="wxpayforapp">微信支付</button></view>
							<!--#endif-->
							<!--#ifdef MP-->
							<view class="paddingtb"><button class="btn weixin block" @click="wxpayfor">微信支付</button></view>
							<!--#endif-->
						</view>
						<view class="list-li" v-if="order.orderstatus == 4">
							<view><button class="btn default block">订单已完成</button></view>
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
	const order = ref();
	onLoad( async (e) => {
		const data = await ajax({
			route:'user-phone-payfor-orderdetail',
			ordersn:e.ordersn
		});
		order.value = data.data.order;
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