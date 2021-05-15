// miniprogram/pages/home_center/device_manage/index.js.js


Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialogShow: false,
    pageList:[
      {icon:'home-o',title:"主页",url:'/pages/home_center/common_panel/index'},
      {icon:'home-o',title:"主页",url:'/pages/home_center/common_panel/index'},
      {icon:'home-o',title:"主页",url:'/pages/home_center/common_panel/index'},
      {icon:'home-o',title:"设备管理",url:'/pages/home_center/device_manage/index'},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { device_icon, device_name, device_id } = options
    this.setData({ device_icon, device_name, device_id })
    let pList = this.data.pageList;
    for(let i=0;i<pList.length;i++ ){
      pList[i].url+=`?device_id=${device_id}&device_name=${device_name}&device_icon=${device_icon}`
    }
    this.setData({
      pageList:pList
    })
    console.log(this.data)
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