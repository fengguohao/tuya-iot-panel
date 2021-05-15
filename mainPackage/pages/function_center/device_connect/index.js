// miniprogram/pages/function_center/device_connet/index.js
import { reqTicket, getClientId } from '../../../../utils/api/common-api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    apUrl: '/pages/web_view/index?urlType=apUrl',
    list: [
      {
        name: 'Wi-Fi AP 配网',
        baseUrl: 'plugin://tuya-ap-plugin/step1'
      },
      {
        name: '蓝牙配网',
        baseUrl: 'plugin://tuya-ap-plugin/ble'
      },
      {
        name: '扫码配网',
        baseUrl: 'plugin://tuya-ap-plugin/virtual'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  gotoPluginpage: async function ({ currentTarget }) {
    const { dataset: { baseurl } } = currentTarget
    console.log(getClientId())
    const [{ ticket }, clientId] = await Promise.all([reqTicket(), getClientId()])
    console.log(baseurl,ticket,clientId)
    wx.navigateTo({
      //url: `${baseurl}?ticket=${ticket}&clientId=${clientId}`,
      url: `${baseurl}?ticket=${ticket}&clientId=m4wh5kaeajgsrv8pep73`,
      
    })
  },

  gotoWebview: function({currentTarget}) {
    const { dataset: { baseurl } } = currentTarget
    wx.navigateTo({
      url: baseurl,
    })
  }

})