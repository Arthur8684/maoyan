// pages/cinema/detail/detail.js
//接口不稳定,有时请求不到数据
var dateshow = '';
Page({
  data:{},
  onLoad(params){
    const that = this;
    const id = params.id,
          url = 'https://m.maoyan.com/showtime/wrap.json?cinemaid='+id;
    that.setData({
        id:id
    })
    wx.request({
      url: url,
      success: function(res){
        //数据加载失败时提示
        if(!res.data){
            wx.showLoading({
                title: '服务器繁忙,请稍后重试...',
                mask:true
            })
            setTimeout(function(){
                wx.hideLoading()
            },1500)
        }
        let title = res.data.data.cinemaDetailModel,
            film = res.data.data.movies;
        that.setData({
            title: title,
            film: film,
        })
        //默认显示首条电影信息
        var comment_id = film[0].id;
        wx.request({
            url: 'https://m.maoyan.com/movie/' + comment_id + '.json',
            success: function (res) {
                console.log(res);
                let movieTitle = res.data.data.MovieDetailModel,
                    bg = res.data.data.MovieDetailModel.img;
                movieTitle.cat = movieTitle.cat.substr(0, movieTitle.cat.indexOf(','));      //影片类型
                movieTitle.star = movieTitle.star.substr(0, movieTitle.star.indexOf(' '));  //演员
                that.setData({
                    movieTitle: movieTitle,
                    bg: bg
                })
            }
        })
        //默认显示播放日期
        wx.request({
            url: 'https://m.maoyan.com/showtime/wrap.json?cinemaid=' + id + '&movieid=' + comment_id,
            success: function (res) {
                dateshow = res.data.data.DateShow;
                let dates = res.data.data.Dates;
                let key = dates[0].slug,
                    list = dateshow[key];
                that.setData({
                    list: list,
                    dates: dates
                })
            }
        })
      }
    })
  },
  //分享
  onShareAppMessage:function(){
      return {
          title : '猫眼小程序，选座更快更优惠'
      }
  },
  //打开地图,获取影院位置
  openLocation(e){
    let lat = e.currentTarget.dataset.lat,
        lng = e.currentTarget.dataset.lng,
        nm = e.currentTarget.dataset.nm,
        addr = e.currentTarget.dataset.addr;
    wx.openLocation({
        latitude: lat, // 纬度，范围为-90~90，负数表示南纬
        longitude: lng, // 经度，范围为-180~180，负数表示西经
        scale: 14, // 缩放比例
        name: nm, // 位置名
        address: addr, // 地址的详细说明
        success: function(){
        }
      })
    },
    //监听电影剧照点击事件
    move(e){
      const that = this;
      let i = e.target.dataset.index,           //img标签下标
          len = e.target.dataset.len.length,    //img标签数量
          bg = e.target.dataset.bg,         //背景图片
          mid = e.target.dataset.id,        //影片id
          cid = e.target.dataset.cid;       //影院id
          that.setData({
            bg:bg
          })
        if(i != 0 && i != len-1){
          that.setData({
            left:i*80
          })
        }else if(i == 0){
          that.setData({
            left:0
          })
        }
        //电影信息
        wx.request({
            url: 'https://m.maoyan.com/movie/' + mid + '.json',
            success:function(res){
                let movieTitle = res.data.data.MovieDetailModel;
                movieTitle.cat = movieTitle.cat.substr(0,movieTitle.cat.indexOf(','));      //影片类型
                movieTitle.star = movieTitle.star.substr(0, movieTitle.star.indexOf(' '));  //演员
                that.setData({
                    movieTitle:movieTitle
                })
            }
        })
        //电影播放日期
        wx.request({
            url: 'https://m.maoyan.com/showtime/wrap.json?cinemaid=' + cid + '&movieid=' + mid,
            success:function(res){
                dateshow = res.data.data.DateShow;
                let dates = res.data.data.Dates;
                let key = dates[0].slug,
                    list = dateshow[key];
                that.setData({
                    dates:dates,
                    list:list
                })
            }
        })
    },
    timeList(e){
        const that = this;
        let key = e.currentTarget.dataset.index,
            list = dateshow[key];
        that.setData({
            list:list
        })
    }
})