// detail.js

Page({
	data: {
		hideText: true,
		hideClass: 'up'
	},
	onLoad(params){
		const that = this;
		const id = params.id,
			  url = 'https://m.maoyan.com/movie/' + id + '.json';
		wx.request({
			url: url,
			success(res){
				let detail = res.data.data.MovieDetailModel,
				    comment = res.data.data.CommentResponseModel.hcmts.splice(0,10);   // 获取热门评论前十
				detail.dra = detail.dra.replace(/(<p>)|(<\/p>)/g,'');
                console.log(detail);
				that.setData({
					detail: detail,
					comment: comment
				});

			}
		})
	},
    onShareAppMessage:function(){
        return {
            title : '猫眼小程序，选座更快更优惠'
        }
    },
	toggleText(){
		let hideText = this.data.hideText,
			hideClass = this.data.hideClass == 'up' ? 'down' : 'up';
		this.setData({
			hideText: !hideText,
			hideClass: hideClass
		})
	}
})