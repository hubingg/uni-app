<template>
	<view class="uni-tab-bar">
		<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
			<view v-for="(tab,index) in tabBars" :key="tab.categoryID" :class="['swiper-tab-list',tabIndex==index ? 'active' : '']"
					:data-id="tab.categoryID" :data-current="index" @tap="tapTab">{{tab.categoryName}}</view>
		</scroll-view>
		<swiper :current="tabIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item v-for="(tab,index1) in tabItemPages" :key="index1">
				<scroll-view class="list" scroll-y @scrolltolower="loadMore(index1)">
					<uni-refresh :refreshType="tabItemPages[index1].refreshType"></uni-refresh>
					<!-- 顶部banner start -->
					<block v-if="banners != null && banners.length > 0">
						<swiper class="swiper" :indicator-dots="false" :autoplay="true" :interval="2000" :duration="500">
							<swiper-item v-for="(banner,index1) in banners" :key="index1">
								<image style="width: 750upx; height: 280upx; background-color: #eeeeee;" :src="resourceHostPic + banner.picUrl" 
									mode="scaleToFill"></image>
							</swiper-item>
						</swiper>
					</block>
					<!-- 顶部banner end -->
					<block v-for="(item2,index2) in listData" :key="index2">
							<!-- <media-list :data="newsitem" @close="close(index1,index2)" @click="goDetail(newsitem)"></media-list> -->
						<find-list :data="item2"></find-list>
					</block>
					<view class="uni-tab-bar-loading">
						<uni-load-more :loadingType="tabItemPages[index1].loadingType"></uni-load-more>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import uniRefresh from '@/components/uni-refresh.vue';
	import uniLoadMore from '@/components/uni-load-more.vue';
	import findList from './find-list.vue';
	import {request} from '@/utils/utils'
	export default {
		components: {
			uniRefresh,
			uniLoadMore,
			findList
		},
		data() {
			return {
				scrollLeft: 0,
				isClickChange: false,
				tabIndex: 0,
				tabBars: [],
				listData: [],
				banners: [],
				newsitems: [],
				categoryID: '-1',
				resourceHostPic: 'https://a8-domain.pagoda.com.cn:11052/miResourceMgr',
				index: 0,
				loadingType: 0,
				tabItemPages: []
			};
		},
		onLoad () {
			this.getTabBars()
		},
		onShow () {
		},
		methods: {
			initItemPage () {
				this.tabItemPages = this.tabBars.map( item => {
					return {
						refreshType: -1,
						loadingType: 0,
						pageNum: 1,
						"banners": [],
						"articles": [],
					}
				})
				this.getFindList()
				
			},
			async tapTab(e) { //点击tab-bar
				if (this.tabIndex === e.target.dataset.current) {
					return false;
				} else {
					let tabBar = await this.getElSize("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
					this.scrollLeft = tabBarScrollLeft;
					this.isClickChange = true;
					this.tabIndex = e.target.dataset.current
					this.categoryID = e.target.dataset.id
					this.getFindList(this.tabIndex)
				}
			},
			async changeTab(e) {
				let index = e.detail.current;
				if (this.isClickChange) {
					this.tabIndex = index;
					this.isClickChange = false;
					return;
				}
				let tabBar = await this.getElSize("tab-bar"),
					tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0;
			
				for (let i = 0; i < index; i++) {
					let result = await this.getElSize(this.tabBars[i].id);
					width += result.width;
				}
				let winWidth = uni.getSystemInfoSync().windowWidth,
					nowElement = await this.getElSize(this.tabBars[index].id),
					nowWidth = nowElement.width;
				if (width + nowWidth - tabBarScrollLeft > winWidth) {
					this.scrollLeft = width + nowWidth - winWidth;
				}
				if (width < tabBarScrollLeft) {
					this.scrollLeft = width;
				}
				this.isClickChange = false;
				this.tabIndex = index; //一旦访问data就会出问题
			},
			getElSize(id) { //得到元素的size
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select('#' + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				});
			},
			// 获取类别
			getTabBars () {
				request(
					{
						url: 'api/v1/discovery/channel/list' ,
						method: 'GET'
					},
					res => {
						if (res.data.errorCode === 0) {
							this.tabBars = res.data.data
							this.newsitems = this.randomfn()
							console.log(this.newsitems)
							this.initItemPage()
						}
					}
				)
			},
			// 获取发现列表
			getFindList (index = 0, pageNum = 1, pageSize = 10) {
				console.log(index)
				let data = {
					categoryID: this.categoryID,
					customerID: '-1',
					pageNum: pageNum,
					pageSize: pageSize
				}
				request(
					{
						url: 'api/v1/discovery/article/list' ,
						method: 'POST',
						data: data
					},
					res => {
						if (res.data.errorCode === 0) {
							let data = res.data.data || {}
							let listData = this.tabItemPages[index].articles || []
							this.listData = listData.concat(data.articles)
							this.tabItemPages[index].hasNextPage = data.hasNextPage
							this.tabItemPages[index].pageNum += 1
							this.tabItemPages[index].banners = data.banners
							this.tabItemPages[index].articles = listData.concat(data.articles)
							if (data.hasNextPage === 'Y') {
								this.tabItemPages[index].loadingType = 0
							} else {
								this.tabItemPages[index].loadingType = 2
							}
							
						}
					}, e => {
						this.tabItemPages[index].refreshType = 0
						this.tabItemPages[index].loadingType = 0
					}
				)
			},
			// 加载更多
			loadMore (index) {
				if (this.tabItemPages[index].hasNextPage === 'Y') {
					this.tabItemPages[index].loadingType = 1
					let pageNum = this.tabItemPages[index].pageNum
					this.getFindList(index, pageNum)
				}
			},
			randomfn() {
				let ary = [];
				for (let i = 0, length = this.tabBars.length; i < length; i++) {
					let aryItem = {
						loadingType: 0,
						data: []
					};
					for (let j = 1; j <= 10; j++) {
						aryItem.data.push(this['data' + Math.floor(Math.random() * 5)]);
					}
					ary.push(aryItem);
				}
				return ary;
			}
		},
	}
</script>

<style>
.uni-swiper-tab {
	width: 100%;
	white-space: nowrap;
}
.swiper-tab-list {
	display: inline-block;
	font-size: 28upx;
	color:rgba(136,136,136,1);
	margin: 0 24upx;
	height: 100upx;
	line-height: 100upx;
	display: inline-block;
}
.active {
	font-size:34upx;
	font-weight:500;
	color:rgba(51,51,51,1);
}
.swiper-box {
	width: 750upx;
	flex: 1;
}
</style>
