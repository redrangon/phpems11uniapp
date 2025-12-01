<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward"><span class="fa fa-chevron-left"></span></view>
				<view class="col-8">强化训练</view>
				<view class="col-1"><span class="fa fa-menu"></span></view>
			</view>
			<view class="page-content header">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content">
			<!--#endif-->
				<view class="list-box bg">
					<view>
						<view class="list-li">
							<h4 class="bigtitle">配卷规则</h4>
						</view>
						<view class="list-li">
							<view class="col-3x">选择章节：</view>
							<view class="col-3l text-right" @click="openSelect()">
								{{ sectionknow }}
								<span class="fa fa-angle-right more"></span>
							</view>
						</view>
						<view class="list-li">
							<view class="col-3x">试卷名称：</view>
							<view class="col-3l">
								<view class="uni-form-item uni-column">
									<input @input="dataChange($event,'title')" class="uni-input" maxlength="12" placeholder="请输入试卷名称" />
								</view>
							</view>
						</view>
						<view class="list-li">
							<view class="col-3x">时间（分钟）：</view>
							<view class="col-3l">
								<view class="uni-form-item uni-column">
									<input class="uni-input" @input="dataChange($event,'time')" value="60" maxlength="3" placeholder="请输入答题时间(数字)" />
								</view>
							</view>
						</view>
						<template v-if="datas.sectionid > 0 && datas.sectionid > 0" v-for="(quest,index) in questype" :key="index">
						<view class="list-li" v-if="numbers && numbers[quest.questid]">
							<view class="col-6">{{quest.questype}}（共{{numbers[quest.questid]}}题），选</view>
							<view class="col-3">
								<view class="uni-form-item uni-column">
									<input class="uni-input" @input="datanumberChange($event,quest.questid)" :value="datas.number[quest.questid]" maxlength="3" placeholder="0" />
								</view>
							</view>
							<view class="col-1">题</view>
						</view>
						</template>
						<view class="list-li">
							<button class="btn primary block" @click="formSubmit()">配题完毕，开始测试</button>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	<uni-popup ref="popup" type="bottom" background-color="#fff" border-radius="20px 20px 0 0">
		<view class="popup-header">
			<view class="padding">选择章节</view>
			<view class="col-5 text-center">章节</view>
			<view class="col-5 text-center">知识点</view>
		</view>
		<view class="popup-content">
			<picker-view :indicator-style="indicatorStyle" @change="bindChange" :value="value" immediate-change="true" class="picker-view">
				<picker-view-column>
					<view class="item" v-for="(section,sid) in sections" :key="sid">{{section.section}}</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(know,kid) in knows" :key="kid">{{know.knows}}</view>
				</picker-view-column>
			</picker-view>
			<view class="uni-padding-wrap">
				<button class="citybtn" @click='setsection'>确定</button>
			</view>
		</view>
	</uni-popup>
</template>
<script setup>
	import ajax from '../../assets/js/ajax';
	import { ref, reactive } from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import config from '../../assets/js/config';
	const knows = ref();
	const datas = ref({'sectionid':'','knowsid':'','time':60,'number':{}});
	const questype = ref();
	const numbers = ref();
	const sections = ref();
	const indicatorStyle= 'height: 50px';
	const value = ref([0,0]);
	const sectionknow = ref('请选择章节');
	const popup = ref(null);
	onLoad( async ()=>{
		await getData();
	})
	const getData = async () => {
		const data = await ajax({
			route:'exam-phone-exercise'
		});
		let sid = 0
		let temsection = {}
		for(let s in data.data.sections){
			temsection[sid] = data.data.sections[s]
			sid++;
		}
		let kid = 0
		let temknows = {}
		for(let k in data.data.knows){
			temknows[kid] = data.data.knows[k]
			kid++;
		}
		sections.value = temsection
		knows.value = temknows
		questype.value = data.data.questype;
	}
	const getKnows = async (sectionid) => {
		const data = await ajax({
			route:'index.php?exam-phone-index-ajax-getknowsbysectionid',
			sectionid:sectionid
		});
		knows.value = data.data.knows
	}
	const bindChange = async (e) => {
		if(value.value[0] && (value.value[0] != e.detail.value[0])){
			await getKnows();
			e.detail.value[1] = 0;
		}
		value.value[0] = e.detail.value[0]??0
		value.value[1] = e.detail.value[1]??0
	}
	const setsection = async () => {
		datas.value.sectionid = sections.value[value.value[0]].sectionid
		datas.value.knowsid = knows.value[value.value[1]].knowsid
		sectionknow.value = sections.value[value.value[0]].section+'-'+knows.value[value.value[1]].knows
		if(popup.value){
			popup.value.close();
		}
		const data = await ajax({
			route:'exam-phone-exercise-ajax-getQuestionNumber',
			sectionid:datas.value.sectionid,
			knowsid:datas.value.knowsid
		})
		numbers.value = data.data.numbers;
	}
	const dataChange = (e,name) => {
		datas.value[name] = e.detail.value;
	}
	const datanumberChange = (e,name) => {
		datas.value.number[name] = e.detail.value;
	}
	const formSubmit = async () => {
		const data = await ajax({
			route:'exam-phone-exercise',
			setExecriseConfig:1,
			args:JSON.stringify(datas.value)
		})
		if(data.statusCode == 200){
			uni.navigateTo({
				url:'/pages/exam/exercise_paper?sessionid=' + data.sessionid + '&token=' + data.token
			})
		}else{
			uni.showToast({
				title:res.data.message,
				icon:'none'
			})
		}
	}
	const openSelect = () => {
		if(popup.value){
			popup.value.open();
		}
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
	.popup-header{
		line-height:80upx;
		font-size:32upx;
	}
	.popup-header .padding{
		padding:20upx 60upx;
	}
	.popup-content{
		height:50vh;
		overflow-y: auto;
		padding:20upx;
	}
	.picker-view {
		width: 100%;
		height:500upx;
		margin-top: 20upx;
	}
	.item {
		line-height: 100upx;
		text-align: center;
		color:#000000;
	}
	.citybtn{
		widht:60vw;
		height:80upx;
		line-height:80upx;
		background-color: #498ef5;
		color:#FFFFFF;
		margin:20upx 80upx;
		border-radius: 40upx;
	}
</style>