<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1">&nbsp;</view>
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
							<view class="col-2 text-center" v-for="(question,qid,index) in allquestions" :key="qid">
								<view v-if="signdatas[index]" class="btn order danger" @click="closeDrawer(index)">{{index+1}}</view>
								<view v-else-if="datas[question.questionid]" class="btn order primary" @click="closeDrawer(index)">{{index+1}}</view>
								<view v-else class="btn order" @click="closeDrawer(index)">{{index+1}}</view>
							</view>
						</view>
					</uni-popup>
				</view>
			</view>
			<view class="page-footer">
				<view class="pagination">
					<view class="col-3x">
						<h5>{{formatTime(time)}}</h5>
					</view>
					<view class="col-3x">
						<button class="btn primary block" @click="dialogToggle()">交卷</button>
					</view>
					<view class="col-2s" @click="showDrawer">
						<span class="fa fa-th"></span>
					</view>
					<view class="col-2s" @click="sign(current)">
						<span v-if="signdatas[current]" class="fa fa-star" style="color: #3498db;"></span>
						<span v-else class="fa fa-star"></span>
					</view>
				</view>
			</view>
		</view>
	</view>
	<view>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog cancelText="取消" confirmText="确定" content="确定要交卷吗？" @confirm="submitPaper"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>
<script setup>
	import ajax from '../../assets/js/ajax';
	import { ref, reactive } from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import config from '../../assets/js/config';
	const current = ref(0);
	const questype = ref();
	const sessionvars = ref();
	const sessionid = ref();
	const token = ref();
	const lefttime = ref();
	const donumber = ref();
	const parents = ref();
	const time = ref();
	const datas = ref({});
	const signdatas = ref({});
	const ctdn = ref();
	const questionid = ref();
	const selector = ref();
	const allquestions = ref({});
	const alertDialog = ref(null);
	const showRight = ref(null);
	onLoad( async (e)=>{
		sessionid.value = e.sessionid;
		token.value = e.token;
		await getLeftTime();
		await getData();
	})
	const backForward = () => {
		uni.navigateBack();
	}
	const getData = async () => {
		const data = await ajax({
			route:'exam-phone-exam-paper',
			sessionid:sessionid.value,
			token:token.value
		});
		questype.value = data.data.questype;
		sessionvars.value = data.data.sessionvars;
		donumber.value = data.data.donumber;
		selector.value = data.data.selectorder;
		time.value = data.data.sessionvars.examsessiontime * 60 - lefttime.value;
		let questions = data.data.sessionvars.examsessionquestion.questions
		let questionrows = data.data.sessionvars.examsessionquestion.questionrows
		let questypelite = data.data.sessionvars.examsessionsetting.examsetting.questypelite
		for(let x in questypelite){
			if(questypelite[x] == 1){
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
		}
		if(time.value <= 0){
			time.value = 0
			submitPaper();
		}
		runTimer();
	}
	const dialogToggle = (item) => {
		if(alertDialog.value){
			alertDialog.value.open();
		}
	}
	const submitPaper = async () => {
		const data = await ajax({
			route:'exam-phone-exam-score',
			insertscore:1,
			token:token.value,
			sessionid:sessionid.value,
			question:JSON.stringify(datas.value)
		})
		if(data.statusCode == 200){
			if(data.needhand == 1){
				uni.redirectTo({
					url:'/pages/exam/history_makescore?ehid='+data.ehid
				})
			}else{
				uni.redirectTo({
					url:'/pages/exam/history_stats?ehid='+data.ehid
				})
			}
		}else{
			uni.showToast({
				title:data.message,
				icon:'none'
			})
		}
	}
	const sign = (id) => {
		if(!signdatas.value[id]){
			signdatas.value[id] = 1
		}else{
			signdatas.value[id] = ''
		}
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
	}
	const datacheckChange = (e,id) => {
		datas.value[id] = e.detail.value;
		datas.value[id].sort();
		datas.value[id] = datas.value[id].join('');
	}
	const editorChange = (e,id) => {
		datas.value[id] = e.detail.html;
	}
	const formatTime = (seconds) => {
		const hrs = Math.floor(seconds / 3600)
		const mins = Math.floor((seconds % 3600) / 60)
		const secs = seconds % 60

		return [
			hrs.toString().padStart(2, '0'),
			mins.toString().padStart(2, '0'),
			secs.toString().padStart(2, '0'),
		].join(':')
	}
	const runTimer = () => {
		let setlefttime = setInterval(()=>{
			if(time.value <= 0){
				clearInterval(setlefttime)
				submitPaper();
			}else{
				time.value--;
			}
		},1000)
	}
	const getLeftTime = async () => {
		const data = await ajax({
			route:'exam-phone-index-ajax-lefttime',
			sessionid:sessionid.value
		})		
		lefttime.value = data.lefttime;
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
		line-height: 80upx;
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