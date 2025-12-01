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
				<view class="uni-margin-wrap" v-if="sessionvars">
					<swiper class="swiper" :current="current" @change="schange">
						<swiper-item v-for="(item,index) in allquestions" :key="index">
							<view class="swiper-item uni-bg-red">
								<view class="list-box bg" v-if="questype && questype[item.questiontype]">
									<view v-if="questype[item.questiontype].questsort == 1">
										<view class="list-li">
											<h5 class="title">第{{current+1}}题 <span>【{{questype[item.questiontype].questype}}】</span></h5>
										</view>
										<view class="list-li" v-if="item.questionparent > 0" v-html="item.qrquestion"></view>
										<view class="list-li" v-html="item.question"></view>
										<view class="list-li">
											<editor @input="editorChange($event,item.questionid)" class="ql-container" showImgSize showImgToolbar showImgResize></editor>
										</view>
										<view class="list-li">
											<button class="btn primary block" @click="checkanswer(item.questionid)">查看答案</button>
										</view>
									</view>
									<view v-else>
										<view class="list-li">
											<h5 class="title">第{{current+1}}题 <span>【{{questype[item.questiontype].questype}}】</span></h5>
										</view>
										<view class="list-li" v-if="item.questionparent > 0" v-html="item.qrquestion"></view>
										<view class="list-li" v-html="item.question"></view>
										<view class="list-li" v-html="item.questionselect"></view>
										<view class="list-li" v-if="questype[item.questiontype].questchoice == 1 || questype[item.questiontype].questchoice == 4">
											<radio-group @change="dataChange($event,item.questionid)">
												<label class="radio" style="margin-right: 30rpx;" v-for="iorder in parseInt(item.questionselectnumber)" :key="item">
													<radio :value="selector[iorder-1]" />{{selector[iorder-1]}}
												</label>
											</radio-group>
										</view>
										<view class="list-li" v-else-if="questype[item.questiontype].questchoice == 2 || questype[item.questiontype].questchoice == 3">
											<checkbox-group @change="datacheckChange($event,item.questionid)">
												<label class="checkbox" style="margin-right: 30rpx;" v-for="iorder in parseInt(item.questionselectnumber)" :key="item">
													<checkbox :value="selector[iorder-1]" />{{selector[iorder-1]}}
												</label>
											</checkbox-group>
										</view>
										<view class="list-li" v-else-if="questype[item.questiontype].questchoice == 5">
											<input @change="dataChange($event,item.questionid)" class="uni-input" placeholder="在这里填写答案" />
										</view>
										<view class="list-li" v-if="questype[item.questiontype].questchoice == 2 || questype[item.questiontype].questchoice == 3">
											<button class="btn primary block" @click="checkanswer(item.questionid)">答题完毕</button>
										</view>
										<view class="list-li" v-if="finish[item.questionid] && datas[item.questionid]">
											<span class="text-danger" v-if="datas[item.questionid] != item.questionanswer">回答错误</span>
											<span class="text-success" v-else>回答正确</span>
										</view>
									</view>
									<view v-if="finish[item.questionid] && datas[item.questionid]">
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
				<view>
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
			</view>
			<view class="page-footer" v-if="allquestions[current]">
				<view class="pagination">
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
	const finish = ref({});
	const sessionvars = ref();
	const eh = ref();
	const questype = ref();
	const datas = ref({});
	const selector = ref();
	const ehid = ref();
	const allquestions = ref({});
	const showRight = ref(null);
	onLoad( async (e)=>{
		ehid.value = e.ehid
		await getData();
	})
	const getData = async () => {
		const data = await ajax({
			route:'exam-phone-history-wrongs',
			ehid:ehid.value
		});
		sessionvars.value = data.data.sessionvars;
		eh.value = data.data.eh;
		questype.value = data.data.questype;
		selector.value = data.data.selectorder;
		let questions = data.data.sessionvars.examsessionquestion.questions
		let questionrows = data.data.sessionvars.examsessionquestion.questionrows
		let questypelite = data.data.sessionvars.examsessionsetting.examsetting.questypelite
		for(let x in questypelite){
			if(questions[x]){
				for(let q in questions[x]){
					if(data.data.sessionvars.examsessionscorelist[questions[x][q].questionid] == 0 || data.data.sessionvars.examsessionscorelist[questions[x][q].questionid] != data.data.sessionvars.examsessionsetting.examsetting.questype[x].score){
						allquestions.value[q] = questions[x][q]
					}
				}
			}
			if(questionrows[x]){
				for(let r in questionrows[x]){
					for(let rq in questionrows[x][r].data){
						if(data.data.sessionvars.examsessionscorelist[questionrows[x][r].data[rq].questionid] == 0 || data.data.sessionvars.examsessionscorelist[questionrows[x][r].data[rq].questionid] != data.data.sessionvars.examsessionsetting.examsetting.questype[x].score){
							allquestions.value[rq] = questionrows[x][r].data[rq]
							allquestions.value[rq].qrquestion = questionrows[x][r].qrquestion
						}
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
	const schange = (e) => {
		current.value = e.detail.current;
	}
	const dataChange = (e,id) => {
		datas.value[id] = e.detail.value;
		finish.value[id] = id
	}
	const datacheckChange = (e,id) => {
		datas.value[id] = e.detail.value;
		datas.value[id].sort();
		datas.value[id] = datas.value[id].join('');
	}
	const editorChange = (e,id) => {
		datas.value[id] = e.detail.html;
	}	
	const checkanswer = (id) =>{
		if(!datas.value[id]){
			uni.showToast({
				title:"请先答题",
				icon:'none',
				duration:1000
			})
		}else{
			finish.value[id] = id
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