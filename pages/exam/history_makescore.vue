<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1">&nbsp;</view>
				<view class="col-8">主观题评分</view>
				<view class="col-1"></view>
			</view>
			<view class="page-content header footer">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content footer">
			<!--#endif-->
				<view class="list-box bg" v-for="(question,index,qnid) in questions" :key="qnid" :style="{'margin-top':qnid >= 1?'10upx':''}">
					<view>
						<view class="list-li">
							<h4 class="title">第{{qnid+1}}题 【{{questype[question.questiontype].questype}}】</h4>
						</view>
						<view class="list-li" v-if="question.questionparent > 0" v-html="question.qrquestion"></view>
						<view class="list-li" v-html="question.question">
						</view>
						<view class="list-li">
							<view class="rows">
								<view class="intro">
									<span class="badge">我的答案</span>
								</view>
								<view class="intro" v-html="eh.ehuseranswer[question.questionid]"></view>
							</view>
						</view>
						<view class="list-li">
							<view class="rows">
								<view v-if="questype[question.questiontype].questsort >= 10">
									<view class="intro">
										<span class="badge">正确答案</span>
									</view>
									<view class="intro" v-html="question.questionanswer"></view>
								</view>
								<view v-else>
									<view class="col-4x intro">
										<span class="badge">正确答案</span>
									</view>
									<view class="col-4l intro" v-html="question.questionanswer"></view>
								</view>
							</view>
						</view>
						<view class="list-li">
							<view class="rows">
								<view v-if="question.questiondescribe.length >= 10">
									<view class="intro">
										<span class="badge">试题解析</span>
									</view>
									<view class="intro" v-html="question.questiondescribe"></view>
								</view>
								<view v-else>
									<view class="col-4x intro">
										<span class="badge">试题解析</span>
									</view>
									<view class="col-4l intro" v-html="question.questiondescribe"></view>
								</view>
							</view>
						</view>
						<view class="list-li">
							<view class="row">
								<view class="intro text-success">
									<span class="pull-left">评分：本题共{{eh.ehsetting.examsetting.questype[question.questiontype].score}}分，得</span>
									<span class="pull-left"><input type="number" class="text-center scoreinput" placeholder="0" min="0" :max="eh.ehsetting.examsetting.questype[question.questiontype].score" @input="dataChange($event,question.questionid)"/></span>
									<span class="pull-left">分</span>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="page-footer">
				<view class="pagination">
					<view class="paddinglr">
						<button class="btn primary block" @click="formSubmit">评分完毕</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
	import ajax from '../../assets/js/ajax';
	import { ref, reactive } from 'vue'
	import { onLoad, onBackPress } from '@dcloudio/uni-app'
	import config from '../../assets/js/config';
	const questype = ref();
	const ehid = ref();
	const eh = ref();
	const score = ref({});
	const questions = ref({});
	onLoad( async (e)=>{
		ehid.value = e.ehid
		await getData();
	})
	const getData = async () => {
		const data = await ajax({
			route:'exam-phone-history-makescore',
			ehid:ehid.value
		});
		questype.value = data.data.questype;
		eh.value = data.data.eh;
		let qs = data.data.eh.ehquestion.questions;
		let qrs = data.data.eh.ehquestion.questionrows;
		for(let x in questype.value){
			if(qs[x]){
				for(let q in qs[x]){
					questions.value[q] = qs[x][q]
				}
			}
			if(qrs[x]){
				for(let r in qrs[x]){
					for(let rq in qrs[x][r].data){
						questions.value[rq] = qrs[x][r].data[rq]
						questions.value[rq].qrquestion = qrs[x][r].qrquestion
					}
				}
			}
		}
	}
	const formSubmit = async () => {
		const data = await ajax({
			route:'exam-phone-history-makescore',
			ehid:ehid.value,
			makescore:1,
			score:JSON.stringify(score.value)
		});
		if(data.statusCode == 200){
			uni.redirectTo({
				url:'/pages/exam/history_stats?ehid='+ehid.value
			})
		}
	}
	const dataChange = (e,id) => {
		score.value[id] = e.detail.value;
	}
	onBackPress((options)=>{
		if(options.from == 'backbutton' || options.from == 'navigateBack'){
			uni.showToast({
				title:'请先进行评分',
				icon:'none'
			})
			return true;
		}
	})
	const backForward = () => {
		uni.navigateBack();
	}
</script>
<style>
	.ico{
		width: 100upx;
		height: 100upx;
	}
	.scoreinput{
		width: 100upx;
		border: solid 1px #eeeeee;
		border-radius: 5upx;
		margin:0 10upx;
	}
</style>