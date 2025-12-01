<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @click="backForward"><span class="fa fa-chevron-left"></span></view>
				<view class="col-8">积分充值</view>
				<view class="col-1"></view>
			</view>
			<view class="page-content header">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content">
			<!--#endif-->
				<view class="list-box bg" v-if="user">
					<view>
						<view class="list-li text-center">当前剩余积分：{{user.usercoin}}</view>
						<view class="list-li">
							<view class="col-5"><h4 class="bigtitle">在线支付</h4></view>
							<view class="col-5 text-right intro" style="line-height: 64upx;">(1元兑换10积分)</view>
						</view>
						<view class="list-li">
							<view class="col-2" style="line-height: 70upx;">充值金额</view>
							<view class="col-8">
								<view class="col-3x paddinglr">
									<button @click="Clickpay(1)" :class="money == 1 ? 'btn primary block' : 'btn default block'">1元</button>
								</view>
								<view class="col-3x paddinglr">
									<button @click="Clickpay(10)" :class="money == 10 ? 'btn primary block' : 'btn default block'">10元</button>
								</view>
								<view class="col-3x paddinglr">
									<button @click="Clickpay(30)" :class="money == 30 ? 'btn primary block' : 'btn default block'">30元</button>
								</view>
							</view>
						</view>
						<view class="list-li">
							<view class="col-2">其他金额</view>
							<view class="col-8">
								<view>
									<input type="number" v-model="money" placeholder="请输入充值金额"/>
								</view>
							</view>
						</view>
						<view class="list-li">
							<button class="btn primary block" @click="formorder()">去支付</button>
						</view>
					</view>
				</view>
				<view class="list-box bg top">
					<view>
						<view class="list-li">
							<h4 class="bigtitle">代金券充值</h4>
						</view>
						<view class="list-li">
							<view>
								<input type="text" maxlength="16" v-model="couponsn" style="background-color: white;" placeholder="请输入16位代金券号码"/>
							</view>
						</view>
						<view class="list-li">
							<button class="btn danger block" @click="submitcoupon">代金券充值</button>
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
	const user = ref();
	const money = ref();
	const couponsn = ref();
	const alertDialog = ref(null);
	onLoad( async () => {
		await getData();
	});
	const getData = async () => {
		const data = await ajax({
			route:'user-phone'
		});
		user.value = data.data._user;
	}
	const backForward = () => {
		uni.navigateBack();
	}
	const Clickpay = (pay) => {
		money.value = pay
	}
	const formorder = async () => {
		const data = await ajax({
			route:'user-phone-payfor',
			money:money.value,
			payforit:1
		});
		console.log(data)
	}
	const submitcoupon = async () => {
		const data = await ajax({
			route:'exam-phone-basics-coupon',
			couponsn:couponsn.value,
			coupon:1
		});
		if(data.statusCode == 200){
			uni.showToast({
				title:'充值成功',
				icon:'none',
				
			})
			couponsn.value = '';
			setTimeout(()=>{
				getData();
			},1000)
		}else{
			uni.showToast({
				title:data.message,
				icon:'none'
			})
		}
	}
</script>
<style>
	
</style>