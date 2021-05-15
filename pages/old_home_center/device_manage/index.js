// miniprogram/pages/home_center/device_manage/index.js.js


Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialogShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { device_icon, device_name, device_id } = options
    this.setData({ device_icon: `https://images.tuyacn.com/${device_icon}`, device_name, device_id })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  showDeviceInfo: function() {
    this.setData({ dialogShow: true })
  }
})