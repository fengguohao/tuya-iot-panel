// miniprogram/pages/home_center/device_list/index.js.js
import {
	getDeviceList,
	getMqttconfig
} from '../../../utils/api/device-api'

import {
	getFamilyList
} from '../../../utils/api/family-api'

import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		active: 0,
		deviceList: [],
		homeList:[],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function(options) {
		const {
			miniProgram
		} = wx.getAccountInfoSync();
		wx.cloud.init({
			env: `ty-${miniProgram.appId}`
		});
		let a = await getFamilyList();
		this.setData({
			homeList:a
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function() {
		const deviceList = await getDeviceList()
		deviceList.forEach(item => {
			item.icon = `https://images.tuyacn.com/${item.icon}`
		})
		this.setData({
			deviceList
		})
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	jumpToPanel({
		currentTarget
	}) {
		const {
			dataset: {
				device
			}
		} = currentTarget
		const {
			id,
			category,
			name,
			icon
		} = device
		switch (name) {
			case 'v-vdevo':
				wx.navigateTo({
					url: `/pages/old_home_center/common_panel/index?device_id=${id}&device_name=${name}&device_icon=${icon}`,
				})
				break;
			default: {
				wx.navigateTo({
					url: `/pages/home_center/common_panel/index?device_id=${id}&device_name=${name}&device_icon=${icon}`,
				})
			}
		}
	},
	addDevice(){
		wx.navigateTo({
			url:"/mainPackage/pages/function_center/device_connect/index"
		})
	},
	onChangeTab(event){
		this.setData({
			active:event.detail.index
		})
	},
	jumpToHomePanel(event){
		let h = event.currentTarget.dataset.home;
		let own=h.role=="OWNER"?"主人":"成员";
		let name=h.name;
		let geo_name=h.geo_name;
		Dialog.alert({
		  title: name,
		  message: '我是'+own+'\n地址：'+geo_name,
		}).then(() => {
		  // on close
		});
	}
})
