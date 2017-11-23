// pages/mine/login/login.js
var savedFilePath = '';
Page({
  data:{
    currentTab: 0
  },
  onLoad:function(options){
    const that = this;
    if (savedFilePath){
        that.setData({
            up: savedFilePath
        })
    }
    wx.login({
      success: function(){
        wx.getUserInfo({
          success: function(res){
            that.setData({
                user:res.userInfo
            })
          }
        })
      }
    })
    wx.getSavedFileInfo({
        filePath: '',
    })
  },
  bindChange: function( e ) {
    var that = this;  
    that.setData( {
       currentTab: e.detail.current
    });
  },
  swichNav: function( e ) {
    var that = this;  
    if( this.data.currentTab === e.target.dataset.current ) {  
      return false;  
    } else {  
      that.setData( {  
        currentTab: e.target.dataset.current  
      })  
    }  
  },
  upload:function(){
    var that = this;
    wx.chooseImage({
        success: function(res) {
            var tempFilePaths = res.tempFilePaths;
            wx.saveFile({
                tempFilePath: tempFilePaths[0],
                success:function(res){
                    savedFilePath = res.savedFilePath;
                    that.setData({
                        up:savedFilePath
                    })
                }
            })
        },
    })
  }
})