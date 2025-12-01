<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward"><span class="fa fa-chevron-left"></span></view>
				<view class="col-8">{{knows && knows.knows}}</view>
				<view class="col-1"></view>
			</view>
			<view class="page-content header footer" @touchstart="touchstart" @touchend="touchend">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content footer" @touchstart="touchstart" @touchend="touchend">
			<!--#endif-->
				<view class="list-box bg" v-if="question">
					<view>
						<view class="list-li">
							<h5 class="title">第{{number}}题 【{{questype.questype}}】</h5>
						</view>
						<view class="list-li" v-if="parent">
							<span v-html="parent.qrquestion"></span>
						</view>
						<view class="list-li">
							<span v-html="question.question"></span>
						</view>
						<view class="list-li" v-if="questype.questsort == 0 && questype.questchoice != 5">
							<span v-html="question.questionselect"></span>
						</view>
						<view class="list-li rightanswer">
							<view class="rows">
								<view class="intro" v-if="question.questiondescribe.length >= 20">
									<view class="intro">
										<span class="badge">正确答案</span>
									</view>
									<view class="intro">
										<span v-html="question.questionanswer"></span>
									</view>
								</view>
								<view v-else>
									<view class="col-4x intro">
										<span class="badge">正确答案</span>
									</view>
									<view class="col-4l intro">
										<span v-html="question.questionanswer"></span>
									</view>
								</view>
							</view>
						</view>
						<view class="list-li rightanswer">
							<view class="rows">
								<view v-if="question.questiondescribe.length >= 20">
									<view class="intro">
										<span class="badge">试题解析</span>
									</view>
									<view class="intro">
										<span v-html="question.questiondescribe"></span>
									</view>
								</view>
								<view v-else>
									<view class="col-4x">
										<span class="badge">试题解析</span>
									</view>
									<view class="col-4l intro">
										<span v-html="question.questiondescribe"></span>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>							
			</view>
			<view class="page-footer">
				<view class="pagination" v-if="question">
					<view class="col-2" @click="favor(question.questionid)">
						<span class="fa fa-star"></span>
					</view>
					<view class="col-6">
						<span @click="inputDialogToggle"><span class="text-success">{{number}}</span>/{{allnumber}}</span>
					</view>
					<view class="col-2">
						<navigator :url="'/pages/exam/reporterror?questionid=' + question.questionid" hover-class="none">
							<span class="fa fa-wrench"></span>
						</navigator>
					</view>
				</view>
			</view>
		</view>
		<view>
			<uni-popup ref="inputDialog" type="dialog">
				<uni-popup-dialog ref="inputClose" mode="input" title="跳转到" placeholder="请输入题目编号" @confirm="dialogInputConfirm"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>
<script setup>
	import ajax from '../../assets/js/ajax';
	import { ref, reactive, nextTick } from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import config from '../../assets/js/config';
	const knowsid = ref();
	const knows = ref();
	const selector = ref();
	const parent = ref();
	const question = ref();
	const questype = ref();
	const number = ref(0);
	const allnumber = ref(0);
	const inputDialog = ref(null);
	const startTime = ref();
	const startPosition = ref();
	const endPosition = ref();
	const datas = ref({});
	onLoad( async (e)=>{
		knowsid.value = e.knowsid
		await getData();
		await getQuestion();
	})
	const getData = async () => {
		const data = await ajax({
			route:'exam-phone-recite-paper',
			knowsid:knowsid.value
		});
		knows.value = data.data.knows
		selector.value = data.data.selectorder
		<!--#ifdef MP-->
		uni.setNavigationBarTitle({
			title: data.data.knows.knows.slice(0,15)
		});
		<!--#endif-->
	}
	const getQuestion = async () => {
		const data = await ajax({
			route:'exam-app-recite-ajax-questions',
			knowsid:knowsid.value,
			number:number.value
		});
		question.value = data.data.question
		questype.value = data.data.questype
		allnumber.value = data.data.allnumber
		parent.value = data.data.parent
		number.value = Number(data.data.number)
	}
	const inputDialogToggle = () =>{
		if(inputDialog.value){
			inputDialog.value.open();
		}
	}
	const touchstart = (e) => {
		startTime.value = Date.now()
		startPosition.value = e.changedTouches[0].clientX
	}
	const touchend = (e) => {
		const endTime = Date.now()
		endPosition.value = e.changedTouches[0].clientX
		if(endTime - startTime.value > 2000){
			return
		}
		if(Math.abs(endPosition.value - startPosition.value) > 50){
			var elePosition = endPosition.value - startPosition.value > 0 ? "right":"left"
		}else{
			return
		}
		if(elePosition == 'left'){
			number.value = number.value + 1;
		}
		if(elePosition == 'right'){
			number.value = number.value - 1;
		}
		if(number.value < 1){
			number.value = 1;
			uni.showToast({
				title:"已经是第一题了",
				icon:'none',
				duration:1000
			})
		}else if(number.value > allnumber.value){
			number.value = allnumber.value;
			uni.showToast({
				title:"已经是最后一题了",
				icon:'none',
				duration:1000
			})
		}else{
			getQuestion();
		}
	}
	const dataChange = (e,id) => {
		datas.value[id] = e.detail.value;
	}
	const datacheckChange = (e,id) => {
		datas.value[id] = e.detail.value;
		datas.value[id].sort();
		datas.value[id] = datas.value[id].join('');
	}
	const editorChange = (e,id) => {
		datas.value[id] = e.detail.html;
	}
	const dialogInputConfirm = (num) => {
		if(isNaN(Number(num))){
			uni.showToast({
				title:"题目编号只能是数字,请正确填写!",
				icon:'none',
				duration:1000
			})
		}else{
			number.value = Number(num);
			if(number.value < 1){
				number.value = 1
			}else if(number.value > allnumber.value){
				number.value = allnumber.value
			}
			getQuestion();				
		}
	}
	const favor = async (id) => {
		const data = await ajax({
			route:'exam-phone-favor-ajax-addfavor',
			questionid:id
		})
		if(data.statusCode == 200){
			uni.showToast({
				title:'收藏成功',
				icon:'none',
				duration:1000
			})
		}else{
			uni.showToast({
				title:data.message,
				icon:'none',
				duration:1000
			})
		}
	}
	const sum = (numbers) => {
		let total = 0;
		for (let x in numbers) {
			total += numbers[x];
		}
		return total;
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
	uni-swiper {
		display: block;
		height: calc(100vh - 216upx);
	}
	input{
		height:80upx;
		line-height:80upx;
		margin:20upx 0;
	}
</style>