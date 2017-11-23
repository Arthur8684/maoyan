//index.js
//获取应用实例
const app = getApp();
Page({
    data: {
        films: [],
        // 控制分页（展示数量）
        offset: 0,
        limit: 10,
        city: '太原市',
        scrollHeight: 0,
        loading: true,
        userInfo: {}
    },
    onLoad: function (data) {
        const that = this
        //调用应用实例的方法获取全局数据
        wx.getSystemInfo({
            success(res){
                that.setData({
                    scrollHeight: res.windowHeight
                })
            }
        });
        this.loadFilms();
    },
    onShow: function () {
        //console.log('Onshow')
        let that = this;
        wx.getStorage({
            key: 'key',
            success: function (res) {
                console.log(res.data.cardmes.city);
                that.setData({
                    city: res.data.cardmes.city,
                })

            }
        })
    },
    // 滑动到底部，加载更多
    lower(e){
        this.setData({
            loading: true
        })
        this.loadFilms()
    },
    //滑动到头部
    bindscrolltoupper(e){
        //console.log(e)
    },
    //加载电影
    loadFilms(){
        const that = this;
        wx.request({
            url: 'https://m.maoyan.com/movie/list.json',
            data:{
                type: "movies",
                offset: this.data.offset,
                limit: 10
            },
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success(res){
                let films = that.data.films;
                films = films.concat( res.data.data.movies );

                that.setData({
                    films: films,
                    offset: that.data.offset + 10,
                    loading: false,
                });
            }
        })
    },
    //分享
    onShareAppMessage:function(){
        return {
            title : '猫眼小程序，选座更快更优惠'
        }
    },
    bindDetail(e){
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: 'detail/detail?id=' + id
        })
    },
    optlocation(){
        wx.navigateTo({
            url: '../switchcity/switchcity'
        })
    }
})
