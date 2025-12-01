<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward"><span class="fa fa-chevron-left"></span></view>
				<view class="col-8" v-if="content">{{content.contenttitle.slice(0,15)}}</view>
				<view class="col-1"><span class="fa fa-menu"></span></view>
			</view>
			<view class="page-content header">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content">
			<!--#endif-->
				<view class="list-box bg">
					<view v-if="content">
						<view class="list-li">
							<h4 class="title text-center">{{content.contenttitle}}</h4>
						</view>
						<view class="list-li more">
							<span class="col-5">发布人：{{content.contentusername}}</span>
							<span class="col-5">发布时间：{{datetime(content.contentinputtime,'ymd')}}</span>
						</view>
						<view class="list-li">
							<span v-html="content.contentdescribe"></span>
						</view>
						<view class="list-li">
							<span v-html="content.contenttext"></span>
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
	const content = ref();
	onLoad( async (e) => {
		const data = await ajax({
			route:'content-app-content',
			contentid:e.contentid
		});
		content.value = data.data.content
		content.value.contenttext = unescapeHtmlEntities(content.value.contenttext)
		<!--#ifdef MP-->
		uni.setNavigationBarTitle({
			title: content.value.contenttitle.slice(0,15)
		});
		<!--#endif-->
	});	
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
	const backForward = () => {
		uni.navigateBack();
	}
	function unescapeHtmlEntities(str) {
	  return str
	    .replace(/&lt;/g, '<')
	    .replace(/&gt;/g, '>')
	    .replace(/&quot;/g, '"')
	    .replace(/&apos;/g, "'")
	    .replace(/&amp;/g, '&')
	}
</script>
<style>
	
</style>