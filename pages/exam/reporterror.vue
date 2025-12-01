<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward"><span class="fa fa-chevron-left"></span></view>
				<view class="col-8">错题反馈</view>
				<view class="col-1"></view>
			</view>
			<view class="page-content header">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content">
			<!--#endif-->
				<view class="list-box bg" style="height: 100%;">
					<view>						
						<view class="list-li">
							<span class="fa fa-angle-right pull-right"></span>
							<picker @change="bindPickerChange" :value="index" :range="fbtypes">
								<view class="uni-input">{{fbtypes[index]}}</view>
							</picker>
						</view>
						<view class="list-li">
							<textarea name="fbcontent" @input="textdata" rows="4" placeholder="请填写错误描述"></textarea>
						</view>
						<view class="list-li">
							<button class="btn primary block" @click="reporterror">提交</button>
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
	const fbtypes = ref(['请选择错误类型','答案错误', '题干错误', '知识点归类错误', '图片错误','解析错误','其他']);
	const index = ref(0);
	const fbquestionid = ref();
	const fbcontent = ref();
	onLoad( async (e) => {
		fbquestionid.value = e.questionid
	});
	const reporterror = async () => {
		const data = await ajax({
			route:'exam-phone-lesson-reporterror',
			'args[fbtype]':fbtypes.value[index.value],
			'args[fbcontent]':fbcontent.value,
			'args[fbquestionid]':fbquestionid.value,
			reporterror:1
		});
		if(data.statusCode == 200){
			uni.showToast({
				title:data.message,
				icon:'none'
			})
			setTimeout(()=>{
				backForward();
			},1500)
		}else{
			uni.showToast({
				title:data.message,
				icon:'none'
			})
		}
	}
	const bindPickerChange = (e) => {
		index.value = e.detail.value
	}
	const textdata = (e) => {
		fbcontent.value = e.detail.value
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
</style>