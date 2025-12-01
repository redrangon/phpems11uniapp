<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward"><span class="fa fa-chevron-left"></span></view>
				<view class="col-8">{{ce && ce.cetitle}}</view>
				<view class="col-1"><span class="fa fa-menu"></span></view>
			</view>
			<view class="page-content header">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content">
			<!--#endif-->
				<view class="list-box bg" v-if="ceq">
					<view>
						<view class="list-li" v-if="ceq.ceqstatus">
							<view v-if="ceq.ceqstatus == 2">
								<image :src="config.host + 'index.php?certificate-phone-certificate-img&ceqid=' + ceq.ceqid" mode="widthFix" style="width: 100%;" webp="true" @click="previewimg(config.host + 'index.php?certificate-phone-certificate-img&ceqid=' + ceq.ceqid)"/>
							</view>
							<view v-else-if="ceq.ceqstatus == 3">
								<button class="btn danger block">您的申请被驳回</button>
							</view>
							<view v-else>
								<button class="btn primary block">您申请的证书尚未出证</button>
							</view>
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
	const ce = ref();
	const ceqid = ref();
	const ceq = ref();
	onLoad(async (e) => {
		ceqid.value = e.ceqid
		await getData();
		await getCertImg();
	});
	const getData = async () => {
		const data = await ajax({
			route:'certificate-phone-certificate-detail',
			ceqid:ceqid.value
		});
		ce.value = data.data.ce;
		ceq.value = data.data.ceq;
	}
	const getCertImg = async () => {
		const data = await uni.request({
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
				route:'certificate-phone-certificate-img',
				ceqid:ceqid.value
			}
		})
		if(data.statusCode == 200){
			console.log(data)
		}
	}
	const previewimg = (imgurl) => {
		let urls = [imgurl]
		uni.previewImage({
			urls: urls
		});
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
