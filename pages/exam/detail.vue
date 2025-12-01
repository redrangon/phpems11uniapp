<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward"><span class="fa fa-chevron-left"></span></view>
				<view class="col-8">考场详情</view>
				<view class="col-1"><span class="fa fa-menu"></span></view>
			</view>
			<view class="page-content header">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content">
			<!--#endif-->
				<view class="list-box bg" v-if="basic">
					<view>
						<view class="list-li">
							<view class="col-4x">
								<view class="rows illus">
									<image :src="config.host + basic.basicthumb" mode="widthFix" class="thumb"/>
								</view>
							</view>
							<view class="col-4l">
								<view class="rows info">
									<h5 class="title">{{basic.basic}}</h5>
									<p v-if="isopen">到期时间：{{datetime(isopen.obendtime,'ymd')}}</p>
									<p v-else>未开通</p>
								</view>
							</view>
						</view>
						<view class="list-li">
							{{basic.basicdescribe}}
						</view>
						<view class="list-li" v-if="isopen">
							<button class="btn primary block" @click="setCurrentBasic()">进入考场</button>
						</view>
						<view v-else>
							<view v-if="allowopen">
								<view v-if="basic.basicdemo == 1">
									<view class="list-li">
										<button class="btn primary block" @click="dialogToggle('success')">免费开通</button>
									</view>
								</view>
								<view v-else>
									<view v-if="prices">
										<view class="list-li" v-for="(p,pid) in prices" :key="pid">
											<view class="rows info" @click="dialogToggle(pid)">
												{{p.price}}积分兑换{{p.time}}天
												<span class="pull-right"><em class="fa fa-chevron-right iconmenu"></em></span>
											</view>
										</view>
									</view>
									<view v-else>
										<view class="list-li">
											<button class="btn danger block">请管理员设置考场价格</button>
										</view>
									</view>
								</view>
							</view>
							<view v-else>
								<view class="list-li">
									<button class="btn danger block">您所在的用户组不能开通本考场</button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view>
			<!-- 提示窗示例 -->
			<uni-popup ref="alertDialog" type="dialog" v-if="prices">
				<uni-popup-dialog cancelText="取消" confirmText="开通" title="开通考场" :content="'确定要使用'+prices[opentype].price+'积分开通'+prices[opentype].time+'天本考试吗？'" @confirm="dialogConfirm(pid)"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>
<script setup>
	import ajax from '../../assets/js/ajax';
	import { ref, reactive } from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import config from '../../assets/js/config';
	const basic = ref();
	const basicid = ref();
	const prices = ref();
	const isopen = ref();
	const allowopen = ref();
	const opentype = ref(0);
	const alertDialog = ref(null);
	onShow( async () => {
		await getData();
	});
	onLoad( async (e)=>{
		basicid.value = e.basicid
		await getData();
	})
	const backForward = () => {
		uni.navigateBack();
	}
	const getData = async () => {
		const data = await ajax({
			route:'exam-phone-basics-detail',
			basicid:basicid.value
		});
		basic.value = data.data.basic;
		prices.value = data.data.price;
		isopen.value = data.data.isopen;
		allowopen.value = data.data.allowopen;
	}
	const dialogToggle = (item) => {
		opentype.value = item
		if(alertDialog.value){
			alertDialog.value.open();
		}
	}
	const dialogConfirm = async () => {
		const data = await ajax({
			route:'exam-phone-basics-openit',
			basicid:basicid.value,
			opencs:1,
			opentype:opentype.value??''
		});		
		if(data.statusCode == 200){
			getData();
		}
	}
	const setCurrentBasic = async () => {
		const data = await ajax({
			route:'exam-phone-index-setCurrentBasic',
			basicid:basicid.value
		});	
		if(data.statusCode == 200){
			if(basic.value.basicexam.model == 2){
				uni.navigateTo({
					url:'/pages/exam/examdetail'
				})
			}else{
				uni.navigateTo({
					url:'/pages/exam/page'
				})
			}
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
</script>
<style>
	.ico{
		width: 100upx;
		height: 100upx;
	}
</style>