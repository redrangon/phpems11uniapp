<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward"><span class="fa fa-chevron-left"></span></view>
				<view class="col-8">背题模式</view>
				<view class="col-1"><span class="fa fa-menu"></span></view>
			</view>
			<view class="page-content header">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content">
			<!--#endif-->
				<view v-for="(section,sid) in sections" :key="sid">
					<view v-if="basic.basicknows[section['sectionid']]" :class="sid > 1 ? 'list-box bg top':'list-box bg'">
						<view class="list-li">
							<h4 class="bigtitle">{{section.section}}</h4>
						</view>
						<view class="list-li" v-for="(know,kid) in basic.basicknows[section['sectionid']]" :key="kid">
							<navigator :url="'/pages/exam/recitepaper?knowsid=' + know" hover-class="none">
							<h5 class="title">{{knows[know].knows}}</h5>
							<p class="intro">共{{sum(knows[know].knowsnumber)}}题<span class='pull-right' v-if="record[know]">上次背到第{{record[know].exernumber}}题，点击继续背题</span><span class='pull-right' v-else>开始背题</span></p>
							</navigator>
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
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import config from '../../assets/js/config';
	const sections = ref();
	const basic = ref();
	const record = ref();
	const knows = ref();
	onShow( async ()=>{
		await getData();
	})
	onLoad( async ()=>{
		await getData();
	})
	const getData = async () => {
		const data = await ajax({
			route:'exam-phone-recite'
		});
		sections.value = data.data.sections;
		basic.value = data.data.basic;
		record.value = data.data.record;
		knows.value = data.data.knows;
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