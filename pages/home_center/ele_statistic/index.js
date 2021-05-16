// miniprogram/pages/home_center/device_list/index.js.js
import {getPerHoursElectricity,getPerDaysElectricity} from '../../../utils/api/device-api'
//


Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		list:[],
		count:0,
		device_id:'',
		device_name:'',
		type:0,
		endTime:''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad:async function(options) {
		let device_id=options.device_id;
		let device_name=options.device_name;
		let type = options.type;//0:查看按天 1:查看按小时
		this.setData({
			device_id,device_name,type
		})
		if(type==0){
			//调用按天接口
			wx.setNavigationBarTitle({title:'用电量统计(逐天统计)'});
			for(let i=0;i<3;i++){
				await this.updateDayList();
			}
		}else if(type==1){
			//调用按小时接口
			wx.setNavigationBarTitle({title:'用电量统计(逐小时统计)'});
			for(let i=0;i<3;i++){
				await this.updateHourList();
			}
		}
		
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {
		
	},
	onReachBottom:async function() { //上拉加载  
		// 通过长度获取下一次渲染的索引  
		if(this.data.type==0){
			if(this.data.count<50){
				await this.updateDayList();
			}else{
				wx.showToast({
				  title: '已经到底了~',
				  icon: 'error',
				  duration: 2000
				})
			}
		}else if(this.data.type==1){
			if(this.data.count<50){
				await this.updateHourList();
			}else{
				wx.showToast({
				  title: '已经到底了~',
				  icon: 'error',
				  duration: 2000
				})
			}
		}else{
			wx.showToast({
			  title: '发生错误~',
			  icon: 'erroe',
			  duration: 2000
			})
		}
		
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function() {
		
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	updateDayList:async function(){
		let device_id = this.data.device_id;
		let code = 'add_ele';
		let count = this.data.count;
		let endTime = this.data.endTime;
		if(count==0){
			endTime = new Date().getTime();
		}
		let startTime = new Date(endTime).setDate(1);
		let start_day = this.generateDay(startTime);
		let end_day = this.generateDay(endTime);
		let a = await getPerDaysElectricity(device_id,code,start_day,end_day);
		count+=1;
		console.log(count,a);
		let list = this.data.list;
		let tList = [];
		for(let i in a.days){
			tList.unshift({key:this.formatDay(i),value:a.days[i]});
		}
		list = list.concat(tList);
		endTime = new Date(startTime).setDate(0);
		this.setData({
			endTime,
			count,
			list
		})
	},
	
	updateHourList:async function(){
		let device_id = this.data.device_id;
		let code = 'add_ele';
		let count = this.data.count;
		let endTime = this.data.endTime;
		if(count==0){
			endTime = new Date().getTime();
		}
		let startTime = new Date(endTime).setHours(0);
		let start_day = this.generateHour(startTime);
		let end_day = this.generateHour(endTime);
		let a = await getPerHoursElectricity(device_id,code,start_day,end_day);
		count+=1;
		let list = this.data.list;
		let tList = [];
		for(let i in a.hours){
			tList.unshift({key:this.formatHour(i),value:a.hours[i]});
		}
		list = list.concat(tList);
		endTime = new Date(startTime).setHours(-1);
		this.setData({
			endTime,
			count,
			list
		})
	},
	
	generateDay(d){
		let date = new Date(d);
		let year = date.getYear() + 1900 + '';
		let month = date.getMonth() + 1 + '';
		let day = date.getDate() + '';
		while (year.length < 4) {
			year = '0' + year;
		}
		while (month.length < 2) {
			month = '0' + month;
		}
		while (day.length < 2) {
			day = '0' + day;
		}
		return year + month + day;
	},
	
	generateHour(h){
		let date = new Date(h);
		let hour = date.getHours() + '';
		while (hour.length < 2) {
			hour = '0' + hour;
		}
		return this.generateDay(h) + hour;
	},
	
	formatDay(d){
		let year = d.substr(0,4);
		let month = d.substr(4,2);
		let day = d.substr(6,2);
		return year + '年' + month + '月' + day + '日';
	},
	
	formatHour(d){
		let hour = d.substr(8,2);
		return this.formatDay(d)+' '+hour+':00~'+hour+':59';
	}
})