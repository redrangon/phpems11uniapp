<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward"><span class="fa fa-chevron-left"></span></view>
				<view class="col-8">{{sessionvars && sessionvars.examsession}}</view>
				<view class="col-1"></view>
			</view>
			<view class="page-content header footer">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content footer">
			<!--#endif-->
				<view class="uni-margin-wrap">
					<swiper class="swiper" :current="current" @change="schange">
						<swiper-item v-for="(item,index) in allquestions" :key="index">
							<view class="swiper-item uni-bg-red">
								<view class="list-box bg">
									<view>
										<view class="list-li">
											<h5 class="title">第{{current+1}}题 <span>【{{questype[item.questiontype].questype}}】</span></h5>
										</view>
										<view class="list-li" v-if="item.questionparent > 0" v-html="item.qrquestion"></view>
										<view class="list-li" v-html="item.question"></view>
										<view class="list-li" v-html="item.questionselect"></view>
										<view class="list-li rightanswer">
											<view class="rows">
												<view class="intro" v-if="sessionvars.examsessionuseranswer[item.questionid] && sessionvars.examsessionuseranswer[item.questionid].length >= 20">
													<view class="intro">
														<span class="badge">我的答案</span>
													</view>
													<view class="intro">
														<span v-html="sessionvars.examsessionuseranswer[item.questionid]"></span>
													</view>
												</view>
												<view v-else>
													<view class="col-4x intro">
														<span class="badge">我的答案</span>
													</view>
													<view class="col-4l intro">
														<span v-html="sessionvars.examsessionuseranswer[item.questionid]"></span>
													</view>
												</view>
											</view>
										</view>
										<view class="list-li rightanswer">
											<view class="rows">
												<view class="intro" v-if="item.questiondescribe.length >= 20">
													<view class="intro">
														<span class="badge">正确答案</span>
													</view>
													<view class="intro">
														<span v-html="item.questionanswer"></span>
													</view>
												</view>
												<view v-else>
													<view class="col-4x intro">
														<span class="badge">正确答案</span>
													</view>
													<view class="col-4l intro">
														<span v-html="item.questionanswer"></span>
													</view>
												</view>
											</view>
										</view>
										<view class="list-li rightanswer">
											<view class="rows">
												<view v-if="item.questiondescribe.length >= 20">
													<view class="intro">
														<span class="badge">试题解析</span>
													</view>
													<view class="intro">
														<span v-html="item.questiondescribe"></span>
													</view>
												</view>
												<view v-else>
													<view class="col-4x">
														<span class="badge">试题解析</span>
													</view>
													<view class="col-4l intro">
														<span v-html="item.questiondescribe"></span>
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
				<uni-popup ref="showRight" type="bottom" background-color="#fff" v-if="sessionvars">
					<view class="popup-header">
						<view class="col-1">&nbsp;</view>
						<view class="col-8 text-center">答题卡</view>
						<view class="col-1 more" @click="closeDrawer()"><span class="fa fa-xmark"></span></view>
					</view>
					<view class="popup-content">
						<view class="col-2 text-center" v-for="(question,qid) in allquestions" :key="qid">
							<view v-if="!eh.ehscorelist[question.questionid]" class="btn order danger" @click="closeDrawer(qid)">{{Number(qid)+1}}</view>
							<view v-else class="btn order" @click="closeDrawer(qid)">{{Number(qid)+1}}</view>
						</view>
					</view>
				</uni-popup>
			</view>
			<view class="page-footer">
				<view class="pagination" v-if="allquestions[current]">
					<view class="col-3x" @click="favor(allquestions[current].questionid)">
						<span class="fa fa-star"></span>
					</view>
					<view class="col-3x" @click="showDrawer">
						<span class="fa fa-th"></span>
					</view>
					<view class="col-3x">
						<navigator :url="'/pages/exam/reporterror?questionid=' + allquestions[current].questionid" hover-class="none">
							<span class="fa fa-wrench"></span>
						</navigator>
					</view>
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
	const current = ref(0);
	const sessionvars = ref();
	const eh = ref();
	const questype = ref();
	const ehid = ref();
	const allquestions = ref({});
	const showRight = ref(null);
	onLoad( async (e)=>{
		ehid.value = e.ehid
		await getData();
	})
	const getData = async () => {
		const data = await ajax({
			route:'exam-phone-history-view',
			ehid:ehid.value
		});
		sessionvars.value = data.data.sessionvars;
		eh.value = data.data.eh;
		questype.value = data.data.questype;
		let questions = data.data.sessionvars.examsessionquestion.questions
		let questionrows = data.data.sessionvars.examsessionquestion.questionrows
		let questypelite = data.data.sessionvars.examsessionsetting.examsetting.questypelite
		for(let x in questypelite){
			if(questions[x]){
				for(let q in questions[x]){
					allquestions.value[q] = questions[x][q]
				}
			}
			if(questionrows[x]){
				for(let r in questionrows[x]){
					for(let rq in questionrows[x][r].data){
						allquestions.value[rq] = questionrows[x][r].data[rq]
						allquestions.value[rq].qrquestion = questionrows[x][r].qrquestion
					}
				}
			}
		}
		
		let qn = 0
		let qs = {}
		for(let s in allquestions.value){
			qs[qn] = allquestions.value[s]
			qn++;
		}
		allquestions.value = qs;
	}
	const schange = (e) => {
		current.value = e.detail.current;
	}
	const showDrawer = () => {
		if(showRight.value){
			showRight.value.open();
		}
	}
	const closeDrawer = (qid) => {
		if(qid >= 0){
			current.value = qid;
		}
		if(showRight.value){
			showRight.value.close();
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
	const backForward = () => {
		uni.navigateBack();
	}
</script>
<style>
	.page-tabs{
		padding:20upx 0;
	}
	.ico{
		width: 100upx;
		height: 100upx;
	}
	uni-swiper {
		display: block;
		height: calc(100vh - 216upx);
	}
	editor{
		border:#E0E0E0 solid 1px;
		padding:20upx;
	}
	#paperform{
		padding: 0px;
	}
	.pagination{
		height:80upx;
	}
	.swiper{
		height:calc(100vh - 216upx);
	}	
	.swiper-item{
		padding:0 20upx;
	}
	.popup-header{
		height:80upx;
		line-height:80upx;
		font-size:32upx;
		text-align: center;
		border-bottom:1px solid #F2f2f2;
	}
	.popup-content{
		height:50vh;
		overflow-y: auto;
		padding:20upx;
	}
</style>