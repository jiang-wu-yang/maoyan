//
const app = getApp();
// 引入SDK核心类，js文件根据自己业务，位置可自行放置
var QQMapWX = require('../../libs/qqmap-wx-jssdk');
var qqmapsdk;

// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: [], //保存当前正在显示的电影列表
    cid: 1, //当前选中项类别id
    cityname:'未选择'
  },

  /*点击导航选项时触发 */
  tapnav(event) {
    let id = event.target.dataset.id;
    this.setData({
      cid: id
    });
    //先去缓存中找，有则直接用，没有就请求
    wx.getStorage({
      key: id,
      success: (res) => { //拿到数据后
        console.log(res)
        //使用缓存中的数据，更新列表
        this.setData({
          movies: res.data
        })
      },
      fail: (err) => { //没有拿到数据
        console.warn(err)
        //重新发送请求，访问cid类别第一页
        this.loadData(id, 0).then(movielist => {
          this.setData({
            movies: movielist
          })
          //把当前movielist，存入storge
          wx.setStorage({
            key: id,
            data: movielist
          })
        })
      }
    })


  },
  /**
   * 加载电影列表数据
   * @param {*} cid     电影类别id
   * @param {*} offset   起始下标位置
   */
  loadData(cid, offset) {
    return new Promise((resolve, reject) => {
      //发送前先弹出一个等待框
      wx.showLoading({
        title: '加载中',
      })

      //执行异步操作
      wx.request({
        url: 'https://api.tedu.cn/index.php',
        method: "GET",
        data: {
          cid,
          offset
        },
        success: (res) => {
          //把服务端返回的列表，交给resolve处理
          resolve(res.data);

          //数据处理完毕后，关闭等待框
          wx.hideLoading()
        }
      })
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //发送请求，访问列表数据
    this.loadData(1, 0).then(movielist => {
      this.setData({
        movies: movielist
      })
    });

    //初始化qqmapdsk
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'ZENBZ-NTDKF-H2TJI-NA5MJ-SDXWH-U2FUC'
    });
    qqmapsdk.reverseGeocoder({
      success:(res)=>{
        let c = res.result.address_component.city;
        //把c存入data
        this.setData({
          cityname:c
        })
      }
    })

    //获取当前位置
    // wx.getLocation({
    //   type:"gcj02",
    //   success:(res)=>{
    //     console.log(res)
    //   }
    // })

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
    //重新加载当前类别的第一页数据
    //不仅需要更新movies，还需存入缓存
    this.loadData(this.data.cid, 0).then(movielist => {
      let cid = this.data.cid;
      this.setData({
        movies: movielist //更新ui
      })
      wx.setStorage({ //更新缓存
        key: cid + '',
        data: movielist
      });
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //发送请求，访问下一页
    let cid = this.data.cid;
    let offset = this.data.movies.length; //查询数据的长度
    this.loadData(cid, offset).then(movielist => {
      //追加到末尾
      let ms = this.data.movies.concat(movielist);
      this.setData({
        movies: ms
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})