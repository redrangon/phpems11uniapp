<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward"><span class="fa fa-chevron-left"></span></view>
				<view class="col-8">考试成绩</view>
				<view class="col-1"></view>
			</view>
			<view class="page-content header footer">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content footer">
			<!--#endif-->
				<view class="list-box bg" v-if="eh">
					<view>
						<view v-if="notviewscore != 0">
							<view class="list-li">
								<view class="rows">
									<h3 class="title text-center">等待公布分数</h3>
									<p class="text-center text-danger more">您已经成功交卷，请等待教师统计并公布分数。</p>
								</view>
							</view>
						</view>
						<view v-else-if="eh.ehstatus == 0">
							<view class="list-li">
								<view class="rows">
									<h3 class="title text-center">等待教师评卷</h3>
									<p class="text-center text-danger">本试卷需要教师评卷，请等待教师评卷完成。</p>
								</view>
							</view>
						</view>
						<view v-else>
							<view class="list-li">
								<view class="paddingtb" v-if="eh.ehispass == 1">
									<h1 class="text-center text-success"><span class="font100">{{Math.floor(sessionvars.examsessionscore)}}</span><span>分</span></h1>
									<view class="text-center text-success">恭喜您通过考试</view>
								</view>
								<view class="paddingtb" v-else>
									<h1 class="text-center text-danger"><span class="font100">{{Math.floor(sessionvars.examsessionscore)}}</span><span>分</span></h1>
									<view class="text-center text-danger">很遗憾您未通过本次考试</view>
								</view>
								<view>
									<view class="col-3x text-center" v-if="eh.ehtype != 0">总分：{{examsetting.score}}分</view>
									<view class="col-3x text-center" v-if="eh.ehtype != 0">及格分：{{examsetting.passscore}}分</view>
									<view class="col-6 text-center" v-else>正确率：{{Math.floor(100 * eh.ehscore / allnumber)}}%</view>
									<view class="col-3x text-center">耗时：
										<span v-if="sessionvars.examsessiontime >= 60">
											<span v-if="sessionvars.examsessiontime % 60">{{Math.floor(sessionvars.examsessiontime / 60) + 1}}</span>
											<span v-else>{{sessionvars.examsessiontime / 60}}</span>分钟
										</span>
										<span v-else>{{sessionvars.examsessiontime}}秒</span></view>
								</view>
							</view>
							<view class="list-li">
								<h4 class="bigtitle">得分详情</h4>
							</view>
							<view class="list-li">
								<view class="table">
										<view class="tr">
											<view class="col-2 th">题型</view>
											<view class="col-2 th">总题数</view>
											<view class="col-2 th">答对</view>
											<view class="col-2 th">总分</view>
											<view class="col-2 th">得分</view>
										</view>
										<template v-for="(num,index) in number" :key="index">
										<view class="tr" v-if="num > 0">
											<view class="col-2 td">{{questype[index].questype}}</view>
											<view class="col-2 td">{{num}}</view>
											<view class="col-2 td">{{right[index]}}</view>
											<view class="col-2 td">{{examsetting.questype[index]?(num * examsetting.questype[index].score).toFixed(2):'0'}}</view>
											<view class="col-2 td">{{scores[index].toFixed(1)}}</view>
										</view>
										</template>
										<view class="tr text-center">
												共{{allnumber}}题 ，做对{{allright}}题，得{{Math.floor(sessionvars.examsessionscore)}}分
										</view>
								</view>
							</view>
							<view class="list-li">
								<h4 class="bigtitle">知识点分析</h4>
							</view>
							<view class="list-li">
								<view class="table">
									<view class="tr">
										<view class="col-4x th">知识点</view>
										<view class="col-4x th">总题数</view>
										<view class="col-4x th">答对</view>
										<view class="col-4x th">正确率</view>
									</view>
									<view class="tr" v-for="(stat,index) in stats" :key="index">
										<view class="col-4x td">{{stat.knows}}</view>
										<view class="col-4x td">{{stat.number}}</view>
										<view class="col-4x td"><span v-if="stat.right">{{stat.right}}</span><span v-else>0</span></view>
										<view class="col-4x td"><span v-if="stat.right">{{(100 * stat.right / stat.number).toFixed(2)}}</span><span v-else>0</span>%</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="page-footer" v-if="model != 2 && notviewscore == 0 && eh.ehstatus != 0">
				<view class="col-3x text-center paddinglr">
					<navigator :url="'/pages/exam/historywrongs?ehid=' + eh.ehid">
						<button class="btn danger block">错题重做</button>
					</navigator>
				</view>
				<view class="col-3x text-center paddinglr">
					<navigator :url="'/pages/exam/historyview?ehid=' + eh.ehid">
						<button class="btn primary block">试卷解析</button>
					</navigator>
				</view>
				<view class="col-3x text-center paddinglr">
					<navigator :url="'/pages/exam/history?ehid=' + eh.ehid">
						<button class="btn default block">考试记录</button>
					</navigator>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
	import ajax from '../../assets/js/ajax';
	import { ref, reactive } from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import config from '../../assets/js/config';
	const stats = ref();
	const ehid = ref();
	const eh = ref();
	const allright = ref();
	const allnumber = ref();
	const right = ref();
	const scores = ref();
	const number = ref();
	const questype = ref();
	const sessionvars = ref();
	const currentbasic = ref();
	const notviewscore = ref();
	const examsetting = ref();
	const model = ref();
	onLoad( async (e)=>{
		ehid.value = e.ehid
		await getData();
	})
	const backForward = () => {
		uni.navigateBack();
	}
	const getData = async () => {
		const data = await ajax({
			route:'exam-phone-history-stats',
			ehid:ehid.value
		});
		stats.value = data.data.stats;
		eh.value = data.data.eh;
		allright.value = data.data.allright;
		allnumber.value = data.data.allnumber;
		right.value = data.data.right;
		scores.value = data.data.score;
		number.value = data.data.number;
		questype.value = data.data.questype;
		sessionvars.value = data.data.sessionvars;
		currentbasic.value = data.data.data.currentbasic;
		notviewscore.value = data.data.data.currentbasic.basicexam.notviewscore;
		examsetting.value = data.data.sessionvars.examsessionsetting.examsetting;
		model.value = data.data.data.currentbasic.basicexam.model;
	}
	const setCurrentBasic = async () => {
		const data = await ajax({
			route:'exam-phone-index-setCurrentBasic',
			basicid:basicid.value
		});	
		if(data.statusCode == 200){
			
		}
	}
</script>
<style>
	.ico{
		width: 100upx;
		height: 100upx;
	}
	.font100{
		font-size:100upx;
	}
</style>