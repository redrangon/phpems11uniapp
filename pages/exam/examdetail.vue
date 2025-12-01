<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward"><span class="fa fa-chevron-left"></span></view>
				<view class="col-8">{{basic && basic.basic}}</view>
				<view class="col-1"><navigator url="/pages/exam/examhistory" hover-class="none"><span class="fa fa-bars"></span></navigator></view>
			</view>
			<view class="page-content header">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content">
			<!--#endif-->
				<view class="list-box bg" v-if="basic">
					<view>
						<view class="list-li">
							<view>
								1、考场开启时间<span v-if="basic.basicexam.opentime.start != 0 && basic.basicexam.opentime.end != 0">{{basic.basicexam.opentime.start}}-{{basic.basicexam.opentime.end}}</span><span v-else>不限</span>，限考次数<span v-if="basic.basicexam.examnumber != 0">{{basic.basicexam.examnumber}}次</span><span v-else>不限</span><br>
								2、点击考试名称或开始考试按钮进入答题界面，考试开始计时。<br>
								3、在考试过程中，您可以通过左下方的考试时间来掌握自己的做题时间。<br>
								4、系统自动记录考试的考试记录，学员考试结束后可在本页点击右上方进入“答题记录”进行查看。
							</view>
						</view>
					</view>
				</view>
				<view v-if="intime == 1">
					<view class="list-box bg top" v-if="sessionvars">
						<view>
							<view class="list-li">
								<view class="rows info">
									<h5 class="title">意外续考</h5>
									<view class="intro">
										系统检测到您曾经在{{datetime(sessionvars.examsessionstarttime)}}开启了一场未完成的考试，试卷名称为《{{sessionvars.examsession}}》，点击继续考试可以进行续考。
									</view>
									<view class="intro" v-if="sessionvars.examsessionsetting">
										<view class="col-3x"> 总分 {{sessionvars.examsessionsetting.examsetting.score}} 分</view>
										<view class="col-3x"> 及格分 {{sessionvars.examsessionsetting.examsetting.passscore}} 分</view>
										<view class="col-3x"> 限时 {{sessionvars.examsessionsetting.examsetting.examtime}} 分钟</view>
									</view>
								</view>
							</view>
							<view class="list-li">
								<view class="rows">
									<view class="col-5 text-center paddinglr">
										<button class="btn primary block" @click="recoverexam()">继续考试</button>
									</view>
									<view class="col-5 text-center paddinglr">
										<button class="btn danger block" @click="dialogToggle()">放弃本次考试</button>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="list-box bg top" v-else-if="basic.basicexam.selectrule == 1">
						<view>
							<view class="list-li">
								<view class="rows">
									<view class="text-center intro" v-if="basic.basicexam.examnumber > 0 && number.all >= basic.basicexam.examnumber">
										<button class="btn danger block">您的考试次数已经用完</button>
									</view>
									<view class="text-center intro" v-else>
										<button class="btn primary block" @click="examselectquestions()">开始考试</button>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="list-box bg top" v-else v-for="(exam,index) in exams" :key="index">
						<view>
							<view class="list-li">
								<h4 class="title">{{exam.exam}}</h4>
								<view class="col-3x">总分：{{exam.examsetting.score}}分</view>
								<view class="col-3x text-center">及格分：{{exam.examsetting.passscore}}分</view>
								<view class="col-3x text-center">限时：{{exam.examsetting.examtime}}分钟</view>
							</view>
							<view class="list-li">
								<button class="btn primary block" @click="examselectquestions(exam.examid)">开始考试</button>
							</view>
						</view>
					</view>
				</view>
				<view v-else>
					<view class="list-box bg top">
						<view>
							<view class="list-li">
								<div class="rows text-center">
									<button class="btn danger block">未在考试时间内，请等待管理员开启考试！</button>
								</div>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	<!-- 提示窗示例 -->
	<uni-popup ref="alertDialog" type="dialog">
		<uni-popup-dialog cancelText="取消" confirmText="确定" title="放弃本次考试" content="放弃考试会删除此次考试会话且不能恢复，确认要放弃吗？" @confirm="clearexamsession()"></uni-popup-dialog>
	</uni-popup>
</template>
<script setup>
	import ajax from '../../assets/js/ajax';
	import { ref, reactive } from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import config from '../../assets/js/config';
	const basic = ref();
	const sessionvars = ref();
	const intime = ref();
	const number = ref();
	const exams = ref();
	const token = ref();
	const alertDialog = ref(null);
	onShow( async ()=>{
		await getData();
	})
	const backForward = () => {
		uni.navigateBack();
	}
	const getData = async () => {
		const data = await ajax({
			route:'exam-phone-exam',
		});
		basic.value = data.data.data.currentbasic;
		sessionvars.value = data.data.sessionvars??'';
		intime.value = data.data.intime;
		number.value = data.data.number;
		token.value = data.data.token;
		exams.value = data.data.exams.data;
		<!--#ifdef MP-->
		uni.setNavigationBarTitle({
			title: data.data.data.currentbasic.basic.slice(0,15)
		});
		<!--#endif-->
	}
	const examselectquestions = async () => {
		const data = await ajax({
			route:'exam-phone-exam-selectquestions'
		});	
		if(data.statusCode == 200){
			uni.navigateTo({
				url:'/pages/exam/exam_paper?sessionid='+data.sessionid+'&token='+data.token
			})
		}else{
			uni.showToast({
				title:data.message,
				icon:'none'
			})
		}
	}
	const recoverexam = async () => {
		const data = await ajax({
			route:'exam-phone-recover',
			sessionid:sessionvars.value.examsessionid,
			token:token.value
		});	
		if(data.statusCode == 200){
			uni.navigateTo({
				url:'/pages/exam/exam_paper?sessionid='+sessionvars.value.examsessionid+'&token='+token.value
			})
		}else{
			uni.showToast({
				title:data.message,
				icon:'none'
			})
		}
	}
	const clearexamsession = async () => {
		const data = await ajax({
			route:'exam-phone-recover-clearexamsession',
			sessionid:sessionvars.value.examsessionid,
			token:token.value
		});	
		if(data.statusCode == 200){
			getData();
		}else{
			uni.showToast({
				title:data.message,
				icon:'none'
			})
		}
	}
	const dialogToggle = () => {
		if(alertDialog.value){
			alertDialog.value.open();
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