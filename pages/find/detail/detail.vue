<template>
	<view>
		<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower"
                @scroll="scroll" v-if="detailData && detailData.article && detailData.author">
			<view class="banner-wrapper">
				<block v-if="detailData.article != null && detailData.article.headerPicUrls.length > 0">
					<swiper class="swiper" :indicator-dots="false" :autoplay="true" :interval="2000" :duration="500">
						<swiper-item v-for="(banner,index1) in detailData.article.headerPicUrls" :key="index1">
							<image class="image-area" style="width: 750upx;height: 380upx;" :src="resourceHostPic + banner" 
								mode="scaleToFill"></image>
							<view class="index-area" v-if="detailData.article.headerPicUrls.length > 0">
								<text class="text-number">{{(index1+1) + '/' + detailData.article.headerPicUrls.length}}</text>
							</view>
						</swiper-item>
					</swiper>
				</block>
			</view>
			<view class="title-wrapper">
				<text class="article-title">{{detailData.article.articleTitle}}</text>
			</view>
			<view class="author-wrapper" @click="goAuthor(detailData.author.authorID)">
				<image class="author-head" style="width: 40upx;height: 40upx;" :src="resourceHostPic + detailData.author.authorPic"></image>
				<text class="author-name">{{detailData.author.authorName}}</text>
			</view>
			<view class="rich-wrapper">
				<!-- <text>{{detailData.article.content}}</text> -->
				<!-- <rich-text :nodes="detailData.article.content"></rich-text> -->
				<wxParse :content="article" @preview="preview" @navigate="navigate" :loading="true" />
				<!-- <view v-html="detailData.article.content"></view> -->
			</view>
			<view class="browse-wrapper">
				<text  class="browse-number">浏览 {{detailData.article.browseCount}}</text>
			</view>
			<view class="comment-wrapper" v-if="commentData && commentData.allCommentCount > 0">
				<view class="comment-title-wrapper">
					<text  class="comment-title-flag">评论</text>
					<text  class="comment-title-number">( {{commentData.allCommentCount}} )</text>
				</view>
				<block v-for="(comment,index) in commentData.comments" :key="index">
					<view class="comment-item-wrapper">
						<view class="comment-item-image-wrapper">
							<image class="head-image" style="width: 60upx;height: 60upx; border-radius: 30upx;" :src="resourceHostPic + comment.customerPic"></image> 
						</view>
						<view class="comment-item-text-wrapper">
							<text  class="comment-item-name">{{comment.customerName}}</text>
							<text  class="comment-item-time">{{comment.createTime}}</text>
							<text  class="comment-item-content">{{comment.comment}}</text>
						</view>
					</view>
				</block>
				<view class="comment-more-wrapper">
					<text  class="comment-more-flag">查看全部评论</text>
					<text  class="comment-more-arrow">></text>
				</view>
			</view>
			<view class="more-wrapper" v-if="detailData.recommendArticles && detailData.recommendArticles.length > 0">
				<view class="more-title-wrapper">
					<text  class="more-title-text">更多内容</text>
				</view>
				<view class="more-list-wrapper">
					<block v-for="(item,index) in detailData.recommendArticles" :key="index">
						<view class="more-list-item-wrapper">
							<image class="more-list-item-image" @click="goDetail(item.article.articleID)" style="width: 330upx;height: 180upx;border-radius: 5upx;" :src="resourceHostPic + item.article.headerPicUrls[0]"></image>
							<text  class="more-list-item-title" @click="goDetail(item.article.articleID)">{{item.article.articleTitle}}</text>
							<view class="more-list-item-user-wrapper" @click="goAuthor(item.author.authorID)">
								<image class="more-list-item-user-head" style="width: 40upx;height: 40upx;border-radius: 20upx;margin-left: 10upx;" :src="resourceHostPic + item.author.authorPic"></image>
								<text  class="more-list-item-user-name">{{item.author.authorName}}</text>
							</view>
						</view>
					</block>
				</view>
			</view>
			<view class="bottom-wrapper">
				<view class="bottom-item-wrapper" @click="likeClick">
					<icon class="bottom-item-image" type="info" size="22" color="#666"></icon>
					<text class="browse-item-text">点赞</text>
				</view>
				<view class="bottom-item-wrapper" @click="shareClick">
					<icon class="bottom-item-image" type="waiting" size="22" color="#666"></icon>
					<text class="browse-item-text">分享</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	//框架来自于：https://github.com/dcloudio/uParse
	//接入方式入下：http://uniapp.dcloud.io/frame?id=npm%E6%94%AF%E6%8C%81
	import wxParse from 'mpvue-wxparse'
	import {request} from '@/utils/utils'
	export default {
		components: {
			wxParse,
		},
		data() {
			return {
				resourceHostPic: 'https://a8-domain.pagoda.com.cn:11052/miResourceMgr',
				detailData: {},
				commentData: {},
				scrollTop: 0,
				article: '<div>我是HTML代码</div>'
			};
		},
		onLoad: function (option) {
			let articleID = option.articleID
			this.getDetail(articleID)
			// this.getComment(articleID)
		},
		methods: {
			getDetail(articleID){
				request(
					{
						url: `api/v1/discovery/article/detail/-1/${articleID}` ,
						method: 'GET'
					},
					res => {
						if (res.data.errorCode === 0) {
							this.detailData = res.data.data
						}
					}
				)
			},
			getComment(articleID){
				let url = host + comment_api;
				let that = this;
				let pageNum = 0;
				let pageSize = 10;
				uni.request({
					url: url,
					method: 'POST',
					header: {
						'content-type': 'application/json'
					},
					data: {
						articleID: articleID,
						customerID: '-1',
						pageNum: pageNum,
						pageSize: pageSize
					},
					success: (res) => {
						that.commentData = res.data.data;
						console.log('getComment success allCommentCount=' + res.data.data.allCommentCount + ' comments=' + res.data.data.comments.length + ' hasNextPage=' + res.data.data.hasNextPage);
					},
					fail: (res) => {
						console.log('getComment fail data=' + JSON.stringify(res.data));
					}
				});
			},
			upper: function(e) {
				console.log(e)
			},
			lower: function(e) {
				console.log(e)
			},
			scroll: function(e) {
				console.log(e)
				//this.old.scrollTop = e.detail.scrollTop
			},
			goDetail:function(articleID){
				uni.navigateTo({
				    url: '/pages/detail/detail?data='+articleID
				})
			},
			goAuthor:function(authorID){
				uni.navigateTo({
				    url: '/pages/author/author?data='+authorID
				})
			},
			likeClick:function(){
				uni.showToast({
					title: '点赞',
					duration: 2000
				});
			},
			shareClick:function(){
				uni.showToast({
					title: '分享',
					duration: 2000
				});
			}
		}
	}
</script>

<style>
	@import url("../../../node_modules/mpvue-wxparse/src/wxParse.css");
	/* .content{
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		background-color: white;
		margin: 0upx;
		padding: 0upx;
	} */
	view{
		display: flex;
	}
	.swiper {
		width: 750upx;
		flex: 1;
		height: 100%;
	}
	.banner-wrapper{
		width: 750upx;
		height: 380upx;
		overflow: hidden;
		margin: 0upx;
		padding: 0upx;
	}
	.title-wrapper{
		min-height: 150upx;
		max-height: 200upx;
		overflow: hidden;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		background-color: white;
	}
	.article-title {
		padding-top: 20upx;
		padding-left: 25upx;
		padding-right: 25upx;
	    font-size: 36upx;
	    color: #555555;
	}
	.author-wrapper{
		height: 80upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		background: white;
	}
	.author-head{
		margin-left: 30upx;
		width: 40upx;
		height: 40upx;
		border-radius: 20upx;
	}
	.author-name{
		margin-left: 20upx;
		font-size: 32upx;
		color: #555555;
	}
	
	.rich-wrapper{
		border-top-width: 1upx;
		border-top-style: solid;
		border-top-color: #f5f5f5;
		padding: 20upx;
		background-color: white;
	}

	.browse-wrapper{
		height: 80upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		background: white;
	}
	.browse-number{
		margin-right: 40upx;
		font-size: 28upx;
		color: #999;
	}
	
	.comment-wrapper{
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		background-color: white;
		margin: 0upx;
		padding: 0upx;
		background-color: white;
	}
	.comment-title-wrapper{
		width: 690upx;
		margin-left: 30upx;
		margin-right: 30upx;
		padding-top: 30upx;
		border-top-width: 1upx;
		border-top-style: solid;
		border-top-color: #f5f5f5;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}
	.comment-title-flag{
		font-size: 32upx;
		color: #333;
	}
	.comment-title-number{
		padding-left: 15upx;
		font-size: 28upx;
		color: #999;
	}
	.comment-item-wrapper{
		width: 690upx;
		margin-left: 30upx;
		margin-right: 30upx;
		padding-top: 20upx;
		padding-bottom: 20upx;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
	}
	.comment-item-image-wrapper{
		justify-content: flex-start;
		align-items: flex-start;
	}
	.comment-item-text-wrapper{
		width: 580upx;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		margin-left: 30upx;
		margin-right: 20upx;
		border-bottom-width: 1upx;
		border-bottom-style: solid;
		border-bottom-color: #f5f5f5;
	}
	.comment-item-name{
		font-size: 28upx;
		color: #666;
	}
	.comment-item-time{
		font-size: 28upx;
		color: #999;
	}
	.comment-item-content{
		font-size: 28upx;
		color: #333;
		padding-bottom: 20upx;
	}
	.comment-more-wrapper{
		width: 690upx;
		height: 100upx;
		margin-top:0upx;
		margin-left: 30upx;
		margin-right: 30upx;
		border-top-width: 1upx;
		border-top-style: solid;
		border-top-color: #f5f5f5;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.comment-more-flag{
		font-size: 28upx;
		color: #333;
	}
	.comment-more-arrow{
		
	}
	
	.more-wrapper{
		width: 750upx;
		border-top-width: 20upx;
		border-top-style: solid;
		border-top-color: #f5f5f5;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		background-color: white;
	}
	.more-title-wrapper{
		padding-top: 30upx;
		padding-left: 30upx;
		padding-right: 30upx;
		height: 100upx;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}
	.more-title-text{
		font-size: 32upx;
		color: #333;
	}
	.more-list-wrapper{
		width: 750upx;
		display: block;  /**这个不能缺少**/
		margin-bottom: 100upx;
	}
	.more-list-item-wrapper{
		width: 330upx;
		margin-left: 30upx;
		margin-bottom: 20upx;
		float: left;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		border-radius: 5upx;
		border-width: 2upx;
		border-style: solid;
		border-color: #f5f5f5;
	}
	.more-list-item-image{
		width: 330upx;
		height: 180upx;
		overflow: hidden;
	}
	.more-list-item-title{
		height: 90upx;
		lines: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-size: 25upx;
		color: #333;
	}
	.more-list-item-user-wrapper{
		width: 330upx;
		height: 60upx;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}
	.more-list-item-user-image{
		margin-left: 20upx;
	}
	.more-list-item-user-name{
		font-size: 28upx;
		color: #666;
		margin-left: 20upx;
	}
	
	.bottom-wrapper{
		position:fixed;
		z-index: 99;
		left: 0px;
		bottom: 0px;
		width: 750upx;
		height: 100upx;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		background-color: white;
		border-top-width: 1upx;
		border-top-color: #f5f5f5;
		border-top-style: solid;
	}
	.bottom-item-wrapper{
		width: 375upx;
		height: 100upx;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.browse-item-image{
		
	}
	.browse-item-text{
		font-size: 28upx;
		color: #666;
		margin-left: 20upx;
	}
	
		
</style>
