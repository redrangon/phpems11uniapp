<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @click="backForward"><span class="fa fa-chevron-left"></span></view>
				<view class="col-8">新闻资讯</view>
				<view class="col-1"></view>
			</view>
			<view class="page-content header footer">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content footer">
			<!--#endif-->
				<view v-for="(cat,index) in cats" :key="index" :class="index > 1?'list-box bg top':'list-box bg'">
					<view v-if="cat.catinmenu == 0 && cat.catindex > 0">
						<view class="list-li">
							<view class="bigtitle">{{cat.catname}}
								<navigator :url="'/pages/content/category?catid=' + cat.catid" class="pull-right" hover-class="none">
								<span class="pull-right fa fa-angle-right"></span>
								</navigator>
							</view>
						</view>
						<view class="list-li" v-for="(content,cid) in contents[cat.catid] && contents[cat.catid].data" :key="cid">
							<view class="rows">
								<navigator :url="'/pages/content/content?contentid=' + content.contentid" hover-class="none">
									<view class="intro">
										{{content.contenttitle.slice(0,16)}}
										<span class="pull-right">{{datetime(content.contentinputtime,'ymd')}}</span>
									</view>
								</navigator>
							</view>
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
	const contents = ref();
	const cats = ref();
	onLoad(async () => {
		const data = await ajax({
			route:'content-app'
		});
		cats.value = data.data.catids;
		contents.value = data.data.contents;
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
</script>