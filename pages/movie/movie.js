// pages/movie/movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    movie: {},        //保存当前电影信息
    isOpen:false   //保存当前简介是否为打开状态
  },

  //点击详情，切换展开收起
  tapIntro(){
    this.setData({
      isOpen:!this.data.isOpen
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    //通过id，查询电影详情信息
    wx.request({
      url: 'https://api.tedu.cn/detail.php',
      data: {
        id,
        id
      },
      success: (res) => {
        //把电影详情信息存入到data中，熏染页面
        this.setData({
          movie: res.data
        })
      }
    })
  },

  //点击剧照后执行
  tapPhoto(event) {
    //获取当前选中项的索引
    let index = event.currentTarget.dataset.index;
    //对url进行处理，去掉@后面的内容
    let urls = [];
    this.data.movie.thumb.forEach(item => {
      let url = item.substring(0, item.lastIndexOf('@'))
      urls.push(url);
    })
    wx.previewImage({
      urls: urls,
      current:urls[index]
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})