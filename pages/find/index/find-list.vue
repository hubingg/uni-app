<template>
	<div>
		<view class="list-cell" hover-class="uni-list-cell-hover">
			<view class="media-list" v-if="data != null">
				<view class="media-top" @click="clickAuthor">
					<block v-if="data.author != null">
						<view class="author-head-wrapper">
							<image class="author-head-image" style="width: 40upx;height: 40upx;" :src="resourceHostPic + data.author.authorPic"></image>
							<image v-if="data.author.isAuthenticated=='Y'" class="author-head-v" style="width:16upx;height:16upx;" src="../../static/img/icon_v_small.png"></image>
						</view>
						<text class="author-name">{{data.author.authorName}}</text>
					</block>
				</view>
				<block v-if="data.article != null"  >
					<view class="media-center" @click="clickItem">
						<image style="width: 700upx;height: 340upx; border-radius: 10upx;" :src="resourceHostPic + data.article.headerPicUrls[0]"></image>
						<!-- <head-image :data="data.article.headerPicUrls"></head-image> -->
					</view>
					<view class="media-bottom" @click="clickItem">
						<text class="article-title">{{data.article.articleTitle}}</text>
					</view>
					<view class="media-foot" @click="clickItem">
						<image class="info-image" style="width:34upx;height:34upx;" src="../../static/icon_dianzan_n.png"></image>
						<text class="info-text">点赞 {{data.article.likeCount}}</text>
						<text class="info-text">评论 {{data.article.browseCount}}</text>
					</view>
				</block>
			</view>
		</view>
	</div>
</template>

<script>
    export default {
		components: {
		},
        props: {
            data: {
                type: Object,
                default: function(e) {
                    return {}
                }
            }
        },
		data() {
			return {
				resourceHostPic: 'https://a8-domain.pagoda.com.cn:11052/miResourceMgr',
			}
		},
        computed: {
             
        },
        methods: {
            close(e) {
                this.$emit('close');
            },
            clickItem(event) {
                this.$emit('clickItem');
            },
			clickAuthor(event){
				this.$emit('clickAuthor');
			}
        }
    }
</script>

<style>
	 view {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
    }

    .list-cell {
        width: 750upx;
        padding: 0upx;
		margin-top: 20upx;
		margin-left: 0upx;
    }
    .uni-list-cell-hover {
        background-color: #eeeeee;
    }

    .media-list {
        flex: 1;
		background-color: #ffffff;
        flex-direction: column;
        padding: 0upx;
		margin: 0upx;
    }
	.media-top{
		height: 80upx;
		padding-left: 25upx;
		padding-right: 25upx;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		background: white;
	}
	.author-head-wrapper{
		position: relative;
		margin-left: 5upx;
		width: 40upx;
		height: 40upx;
	}
	.author-head-image{
		position: absolute;
		width: 40upx;
		height: 40upx;
		border-radius: 20upx;
	}
	.author-head-v{
		position: absolute;
		right: 0upx;
		bottom: 0upx;
	}
	.author-name{
		margin-left: 20upx;
	}

    .media-center {
		background-color: #ffffff;
		padding-left: 25upx;
		padding-right: 25upx;
        width: 750upx;
		 
		/* height: 340upx; 这里不能加高度,否则会导致里面的自定义组件只显示80%的高度*/
    }
	.head-image{
		width: 700upx;
		/* height: 340upx; 这里不能加高度,否则会导致里面的自定义组件只显示80%的高度*/
	}

	.media-bottom{
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}
    .article-title {
        flex: 1;
		background-color: #ffffff;
    }

    .article-title {
		padding-top: 10upx;
		padding-left: 25upx;
		padding-right: 25upx;
        lines: 2;
		overflow: hidden;
        text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
        font-size: 32upx;
        color: #555555;
    }

    .media-foot {
		height: 60upx;
		padding-left: 25upx;
		padding-right: 25upx;
        margin-top: 0upx;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		background: white;
    }
	.info-text {
		margin-left: 5upx;
	    margin-right: 20upx;
	    color: #999999;
	    font-size: 24upx;
	}

    .max-close-view {
        align-items: center;
        justify-content: flex-end;
        flex-direction: row;
        height: 40upx;
        width: 80upx;
    }

    .close-view {
        border-style: solid;
        border-width: 1px;
        border-color: #999999;
        border-radius: 10upx;
        justify-content: center;
        height: 30upx;
        width: 40upx;
        line-height: 30upx;
    }

    .close {
        text-align: center;
        color: #999999;
        font-size: 28upx;
    }
</style>
