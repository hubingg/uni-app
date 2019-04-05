<template>
	<view>
		<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
			<view v-for="(tab,index) in tabBars" :key="tab.categoryID" :class="['swiper-tab-list',tabIndex==index ? 'active' : '']"
					:id="tab.categoryID" :data-current="index" @tap="tapTab">{{tab.categoryName}}</view>
		</scroll-view>
		<swiper :current="tabIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item v-for="(tab,index1) in newsitems" :key="index1">{{index1}}
				<scroll-view class="list" scroll-y @scrolltolower="loadMore(index1)">
						<block v-for="(newsitem,index2) in tab.data" :key="index2">
							11111
								<!-- <media-list :data="newsitem" @close="close(index1,index2)" @click="goDetail(newsitem)"></media-list> -->
						</block>
						<view class="uni-tab-bar-l<!-- oading">
							<uni-load-more :loadingType="tab.loadingType" :contentText="loadingText"></uni-load-more>
						</view> -->
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more.vue';
	import {request} from '@/utils/utils'
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				loadingText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				scrollLeft: 0,
				isClickChange: false,
				tabIndex: 0,
				tabBars: [],
				newsitems: []
			};
		},
		onLoad () {
			this.getTabBars()
		},
		onShow () {
			console.log(1)
		},
		methods: {
			async tapTab(e) { //点击tab-bar
				if (this.tabIndex === e.target.dataset.current) {
					return false;
				} else {
					let tabBar = await this.getElSize("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
					this.scrollLeft = tabBarScrollLeft;
					this.isClickChange = true;
					this.tabIndex = e.target.dataset.current
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
			getTabBars () {
				request(
					{
						url: 'api/v1/discovery/channel/list' ,
						method: 'GET'
					},
					res => {
						if (res.data.errorCode === 0) {
							this.tabBars = res.data.data
							console.log(this.tabBars)
							
							this.newsitems = this.randomfn()
							console.log(this.newsitems)
						}
					}
				)
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
}
.active {
	font-size:34px;
	font-weight:500;
	color:rgba(51,51,51,1);
}
</style>
