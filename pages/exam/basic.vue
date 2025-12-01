<template>
	<view class="pages">
		<view class="page-tabs">
			<!--#ifdef !MP-->
			<view class="page-header">
				<view class="col-1" @tap="backForward"><span class="fa fa-chevron-left"></span></view>
				<view class="col-8">开通考场</view>
				<view class="col-1"><span class="fa fa-menu"></span></view>
			</view>
			<view class="page-content header">
			<!--#endif-->
			<!--#ifdef MP-->
			<view class="page-content">
			<!--#endif-->
				<scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="lower" lower-threshold="50">
				<view class="list-box bg">
					<view>
						<view class="list-li" v-for="(basic,index) in basics" :key="index">
							<navigator :url="'/pages/exam/detail?basicid=' + basic.basicid">
							<view class="col-4x">
								<view class="rows illus">
									<image :src="domain + basic.basicthumb" mode="widthFix" class="thumb"/>
									<span class="rows badge" v-if="basic.isopen">已开通</span>
								</view>
							</view>
							<view class="col-4l">
								<view class="rows info">
									<h5 class="title">{{basic.basic}}</h5>
									<p class="intro">{{basic.basicdescribe.slice(0,30)}}</p>
								</view>
							</view>
							</navigator>
						</view>
					</view>
				</view>
				<view class="text-center" style="line-height: 100upx;">{{loadmore}}</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				domain: base.domain,
				basics: [],
				current: 1,  //当前页
				total: 1,  //总数据量
				pageSize: 10 ,//每页数据量
				loadmore:'上滑加载更多'
			}
		},
		onShow:function(){
			//
		},
		onLoad:function() {
			this.requestdata();
		},
		methods: {
			backForward:function(){
				uni.navigateBack();
			},
			lower: function() {
				this.loadmore = '加载中...';
				if(this.current < this.total/this.pageSize){
					this.current = this.current + 1;
					setTimeout(() => {
						this.requestdata();
						this.loadmore = '上滑加载更多';
					},300);
				}else{
					this.loadmore = '没有更多数据了';
				}
			},
			requestdata(){
				uni.request({
					url:base.website + 'exam.php?action=basic&number=' + this.pageSize + '&page=' + this.current,
					header:{
						'content-type': 'application/x-www-form-urlencoded',
						'cookie':uni.getStorageSync('cookie')
					},
					method:'POST',
					data:{},
					success:res=>{
						if(res.data.statusCode == 200){
							this.total = res.data.basics.number;
							this.basics = [...this.basics,...res.data.basics.data];
							if(this.pageSize >= res.data.basics.number){
								this.loadmore = ''
							}
						}else{
							uni.showToast({
								title:res.data.message,
								icon:'none'
							})
						}
					}
				})
			}
		}
	}
</script>
<style>
	.ico{
		width: 100upx;
		height: 100upx;
	}
</style>