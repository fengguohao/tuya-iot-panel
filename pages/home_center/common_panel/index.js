// miniprogram/pages/home_center/common_panel/index.js.js
import {
	getDevFunctions,
	getDeviceDetails,
	deviceControl,
	getFullElectricity,
	getPerHoursElectricity,
	getPerDaysElectricity,
	ctrlSocketWorkStatus,
	getAllStatus,
	getDeviceCountdown,
	addDeviceTimer,
	testInterface,
	editTimer,
	deleteByCategory,
	editStatusByCategory,
	deleteByGroupid
} from '../../../utils/api/device-api'
import wxMqtt from '../../../utils/mqtt/wxMqtt'
import * as echarts from '../../../ec-canvas/echarts';
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog'


const app = getApp();

var dataList = [];
var k = 0;
var Chart1 = null;
var Chart2 = null;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		device_name: '',
		current: 0,
		power: 0,
		voltage: 0,
		timeRemain: 0,
		workStatus: false,
		titleItem: {
			name: '',
			value: '',
		},
		roDpList: {}, //只上报功能点
		rwDpList: {}, //可上报可下发功能点
		isRoDpListShow: false,
		isRwDpListShow: false,
		closePic: 'https://fguohao-picstorage.oss-cn-beijing.aliyuncs.com/socket-close.png',
		openPic: 'https://fguohao-picstorage.oss-cn-beijing.aliyuncs.com/socket-open.png',
		pageList: [{
				icon: 'home-o',
				title: "设备"
			},
			{
				icon: 'bar-chart-o',
				title: "统计"
			},
			{
				icon: 'underway-o',
				title: "定时任务"
			},
			{
				icon: 'edit',
				title: "设备管理"
			},
		],
		onChangeFunc: {
			onChange: (event) => {
				if(event.detail<3){
					getCurrentPages().slice(-1)[0].setData({
						currentPage: event.detail
					});
				}
				if (event.detail == 1) {
					getCurrentPages().slice(-1)[0].onLoadStatictics();
				}
				if (event.detail == 2) {
					getCurrentPages().slice(-1)[0].getTimers();
				}
				if (event.detail == 3) {
					let device_icon = getCurrentPages().slice(-1)[0].data.device_icon;
					let device_name = getCurrentPages().slice(-1)[0].data.device_name;
					let device_id = getCurrentPages().slice(-1)[0].data.device_id;
					wx.navigateTo({
						url: '/pages/home_center/device_manage/index?device_icon=' + device_icon +
							"&device_name=" + device_name + "&device_id=" + device_id
					})
				}
			},
		},
		currentPage: 0,
		editingTimer: false,
		statistics: {
			fullElectricity: 0,
			perDaysElectricity: [],
			perDaysElectricityIndex: [],
			perHoursElectricity: [],
			perHoursElectricityIndex: [],
		},
		ec: {
			lazyLoad: true // 延迟加载
		},
		activeNames: ['1'],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

		this.setData({
			workStatus: true
		})
		const {
			device_id,
			device_name,
			device_icon
		} = options
		this.setData({
			device_id,
			device_name,
			device_icon
		})
		// mqtt消息监听
		wxMqtt.on('message', (topic, newVal) => {
			const {
				status
			} = newVal
			console.log(newVal)
			this.updateStatus(status)
		})
		// addDeviceTimer(this.data.device_id,"0000000",'test',[
		//   {
		//       "code":"switch",
		//       "value":false
		//   }],"20210514","1:32")

	},
	onLoadStatictics: async function() {
		wx.showLoading({
			title: '加载中',
		});
		this.echartsrecent7days = this.selectComponent('#mychart-recent7days');
		this.echartsrecent24hours = this.selectComponent('#mychart-recent24hours');
		await this.updateStatistic();
		this.init_echarts();
		wx.hideLoading();
	},
	init_echarts: function() {
		this.echartsrecent7days.init((canvas, width, height) => {
			// 初始化图表
			Chart1 = echarts.init(canvas, null, {
				width: width,
				height: height
			});
			// Chart.setOption(this.getOption());
			this.setOption(Chart1, this.getOptionOfRecent7days());
			// 注意这里一定要返回 chart 实例，否则会影响事件处理等
			return Chart1;
		});
		this.echartsrecent24hours.init((canvas, width, height) => {
			// 初始化图表
			Chart2 = echarts.init(canvas, null, {
				width: width,
				height: height
			});
			// Chart.setOption(this.getOption());
			this.setOption(Chart2, this.getOptionOfRecent24hours());
			// 注意这里一定要返回 chart 实例，否则会影响事件处理等
			return Chart2;
		});
	},
	setOption: function(Chart, option) {
		Chart.clear(); // 清除
		Chart.setOption(option); //获取新数据
	},

	onChangeAutoPage(event) {
		this.setData({
			activeNames: event.detail,
		});
	},
	updateStatistic: async function() {
		let perDaysElectricityIndex = []
		let perDaysElectricity = []
		let perHoursElectricityIndex = []
		let perHoursElectricity = []

		let currentDate = new Date();
		let endDay = this.dateFormat(currentDate);

		currentDate = currentDate.setDate(currentDate.getDate() - 6);
		currentDate = new Date(currentDate);
		let startDay = this.dateFormat(currentDate);

		currentDate = new Date();
		let endHour2 = this.hourFormat(currentDate);
		let hoursCount = currentDate.getHours();
		currentDate = currentDate.setHours(0);
		currentDate = new Date(currentDate);
		let startHour2 = this.hourFormat(currentDate)
		currentDate = currentDate.setHours(currentDate.getHours() - 1);
		currentDate = new Date(currentDate);
		let endHour1 = this.hourFormat(currentDate);
		currentDate = currentDate.setHours(currentDate.getHours() - (23 - hoursCount));
		currentDate = new Date(currentDate);
		let startHour1 = this.hourFormat(currentDate);
		let a = {
				hour: []
			},
			b = {
				hour: []
			};

		const [{
			total
		}, {
			days
		}] = await Promise.all([
			getFullElectricity(this.data.device_id, 'add_ele'),
			getPerDaysElectricity(this.data.device_id, 'add_ele', startDay, endDay),
		])
		if (startHour1 != endHour1) {
			a = await getPerHoursElectricity(this.data.device_id, 'add_ele', startHour1, endHour1);
		}
		if (startHour2 != endHour2) {
			b = await getPerHoursElectricity(this.data.device_id, 'add_ele', startHour2, endHour2);
		}

		for (let i in days) {
			let thisday = i.substr(4, 2) + '月' + i.substr(6, 2) + '日';
			perDaysElectricityIndex.push(thisday);
			perDaysElectricity.push(days[i]);
		}
		for (let i in a.hours) {
			let thishour = i.substr(8, 2) + '时';
			perHoursElectricityIndex.push(thishour);
			perHoursElectricity.push(a.hours[i]);
		}
		for (let i in b.hours) {
			let thishour = i.substr(8, 2) + '时';
			perHoursElectricityIndex.push(thishour);
			perHoursElectricity.push(b.hours[i]);
		}
		this.setData({
			statistics: {
				fullElectricity: total,
				todayElectricity: perDaysElectricity.slice(-1)[0],
				perDaysElectricity,
				perDaysElectricityIndex,
				perHoursElectricity,
				perHoursElectricityIndex,
			}
		})
	},
	getOptionOfRecent7days: function() {
		let a = this.data.statistics.perDaysElectricity;
		let b = this.data.statistics.perDaysElectricityIndex;
		// 指定图表的配置项和数据
		var option = {
			xAxis: {
				type: 'category',
				data: b,

			},
			yAxis: {
				type: 'value',

			},
			series: [{
				data: a,
				smooth: true,
				type: 'line'
			}],
			tooltip: {
				show: true,
				trigger: 'axis'
			},
		}
		return option;
	},
	getOptionOfRecent24hours: function() {
		let a = this.data.statistics.perHoursElectricity;
		let b = this.data.statistics.perHoursElectricityIndex;

		// 指定图表的配置项和数据
		var option = {
			xAxis: {
				type: 'category',
				data: b,
			},
			yAxis: {
				type: 'value',

			},
			series: [{
				data: a,
				smooth: true,
				type: 'line'
			}],
			tooltip: {
				show: true,
				trigger: 'axis'
			},
		}
		return option;
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: async function() {
		wx.showLoading({
			title: '加载中',
		})

		const {
			device_id
		} = this.data
		const [{
			name,
			status,
			icon
		}, {
			functions = []
		}] = await Promise.all([
			getDeviceDetails(device_id),
			getDevFunctions(device_id),
		]);

		//getFullElectricity(device_id,'add_ele');
		//getPerHoursElectricity(device_id,'add_ele','2021050900','2021050911');
		//getPerDaysElectricity(device_id,'add_ele','20210501','20210508');
		//ctrlSocketWorkStatus(device_id,"switch",true);
		//getAllStatus(device_id)
		const {
			roDpList,
			rwDpList
		} = this.reducerDpList(status, functions)
		// 获取头部展示功能点信息
		let titleItem = {
			name: '',
			value: '',
		};
		if (Object.keys(roDpList).length > 0) {
			let keys = Object.keys(roDpList)[0];
			titleItem = roDpList[keys];
		} else {
			let keys = Object.keys(rwDpList)[0];
			titleItem = rwDpList[keys];
		}

		const roDpListLength = Object.keys(roDpList).length
		const isRoDpListShow = Object.keys(roDpList).length > 0
		const isRwDpListShow = Object.keys(rwDpList).length > 0

		this.setData({
			titleItem,
			roDpList,
			rwDpList,
			device_name: name,
			isRoDpListShow,
			isRwDpListShow,
			roDpListLength,
			icon
		})
		this.setData({
			power: this.data.roDpList.cur_power.value,
			voltage: this.data.roDpList.cur_voltage.value,
			current: this.data.roDpList.cur_current.value,
			timeRemain: this.data.rwDpList.countdown_1.value,
			workStatus: this.data.rwDpList.switch.value
		})
		wx.hideLoading();

	},

	// 分离只上报功能点，可上报可下发功能点
	reducerDpList: function(status, functions) {
		// 处理功能点和状态的数据
		let roDpList = {};
		let rwDpList = {};
		if (status && status.length) {
			status.map((item) => {
				const {
					code,
					value
				} = item;
				let isExit = functions.find(element => element.code == code);
				if (isExit) {
					let rightvalue = value
					// 兼容初始拿到的布尔类型的值为字符串类型
					if (isExit.type === 'Boolean') {
						rightvalue = (value === 'true') || (value === true)
					}

					rwDpList[code] = {
						code,
						value: rightvalue,
						type: isExit.type,
						values: isExit.values,
						name: isExit.name,
					};
				} else {
					roDpList[code] = {
						code,
						value,
						name: code,
					};
				}
			});
		}
		return {
			roDpList,
			rwDpList
		}
	},

	sendDp: async function(e) {
		const {
			dpCode,
			value
		} = e.detail
		const {
			device_id
		} = this.data

		const {
			success
		} = await deviceControl(device_id, dpCode, value)
	},

	updateStatus: function(newStatus) {
		let {
			roDpList,
			rwDpList,
			titleItem
		} = this.data

		newStatus.forEach(item => {
			const {
				code,
				value
			} = item

			if (typeof roDpList[code] !== 'undefined') {
				roDpList[code]['value'] = value;
			} else if (rwDpList[code]) {
				rwDpList[code]['value'] = value;
			}
		})

		// 更新titleItem
		if (Object.keys(roDpList).length > 0) {
			let keys = Object.keys(roDpList)[0];
			titleItem = roDpList[keys];
		} else {
			let keys = Object.keys(rwDpList)[0];
			titleItem = rwDpList[keys];
		}

		this.setData({
			titleItem,
			roDpList: {
				...roDpList
			},
			rwDpList: {
				...rwDpList
			}
		})
		this.setData({
			power: this.data.roDpList.cur_power.value,
			voltage: this.data.roDpList.cur_voltage.value,
			current: this.data.roDpList.cur_current.value,
			timeRemain: this.data.rwDpList.countdown_1.value,
			workStatus: this.data.rwDpList.switch.value
		})
	},
	startCountDown: async function() {
		let sw = this.data.rwDpList.countdown_1;
		deviceControl(this.data.device_id, sw.code, this.data.countdowntime);
	},
	ctrlSocket: function() {
		let sw = this.data.rwDpList.switch;
		deviceControl(this.data.device_id, sw.code, !sw.value);
	},
	onChangeTimeRemain: function(event) {
		this.setData({
			countdowntime: event.detail
		})
	},
	getTimers: async function() {
		wx.showLoading({
			title: '加载中',
		});
		let a = await this.getSocketCountdown();
		let weekIdx = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
		for (let i in a) {
			for (let j in a[i].groups) {
				let loops = (a[i].groups)[j].timers[0].loops;
				let loopStr = "";
				let isLoop = true;
				let instr = '';
				if (loops == "0111110") {
					loopStr = "周一~周五";
				} else if (loops == '1000001') {
					loopStr = "周六~周日";
				} else if (loops == '1111111') {
					loopStr = '每天';
				} else if (loops == '0000000') {
					let dateStr = (a[i].groups)[j].timers[0].date;
					loopStr = dateStr.substr(0, 4) + '年' + dateStr.substr(4, 2) + '月' + dateStr.substr(6,
						2) + '日';
					isLoop = false;
				} else {
					for (let idx = 0; idx < 7; idx++) {
						if (loops[idx] == 1) {
							loopStr += weekIdx[idx]
						}
					}
				}
				let func = (a[i].groups)[j].timers[0].functions;

				for (let f in func) {
					if (func[f].code == 'switch') {
						instr += func[f].value ? '开启插座' : '关闭插座';
					}
				}

				let working = false;
				if ((a[i].groups)[j].timers[0].status == 1) {
					working = true;
				}
				(a[i].groups)[j].timers[0].loopStr = loopStr;
				(a[i].groups)[j].timers[0].isLoop = isLoop;
				(a[i].groups)[j].timers[0].instr = instr;
				(a[i].groups)[j].timers[0].working = working;
			}
		}
		this.setData({
			timerList: a
		})
		wx.hideLoading();
	},

	updateTimer: async function(a, category) {
		await editTimer(this.data.device_id, a.id, a.timers[0].loops, category, a.timers[0]);
	},

	ctrlSocketCountdown: function(count) {
		count = count % 86400;
		let sw = this.data.rwDpList.countdown_1;
		deviceControl(this.data.device_id, sw.code, count);
	},

	getSocketCountdown: async function() {
		let a = await getDeviceCountdown(this.data.device_id);
		return a;
	},

	dateFormat(date) {
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

	hourFormat(date) {
		let hour = date.getHours() + '';
		while (hour.length < 2) {
			hour = '0' + hour;
		}
		return hour = this.dateFormat(date) + hour;
	},
	toeditpage(e) {
		let catagoryIdx = e.currentTarget.dataset.group;
		let timerIdx = e.currentTarget.dataset.timer;
		let group_id = (this.data.timerList[catagoryIdx].groups)[timerIdx].id;
		let catagoryname = (this.data.timerList[catagoryIdx].category).category;
		wx.navigateTo({
			url: "/pages/home_center/timer_edit/index?createTimer=" + 0 + "&device_id=" + this.data
				.device_id + "&device_name=" + this.data.device_name + "&group_id=" + group_id +
				'&category=' + catagoryname
		})
	},
	addTimer(e) {
		wx.navigateTo({
			url: "/pages/home_center/timer_edit/index?createTimer=" + 1 + "&device_id=" + this.data
				.device_id + "&device_name=" + this.data.device_name
		})
	},
	deleteCategory: async function(e) {
		Dialog.confirm({
			title: '确认要删除该策略下的所有任务组吗？',
		})
		.then(async () => {
			let category = e.currentTarget.dataset.category;
			await deleteByCategory(this.data.device_id, category);
			this.getTimers();
		})
		.catch(()=>{})
			

	},
	deleteGroup: async function(e) {
		console.log(e)
		
		Dialog.confirm({
			title: '确认要删除该任务组吗？',
		})
		.then(async () => {
			let category = e.currentTarget.dataset.category;
			let group_id = e.currentTarget.dataset.groupid;
			console.log(category,group_id)
			await deleteByGroupid(this.data.device_id, category,group_id);
			this.getTimers();
		})
		.catch(()=>{})
			
	
	},
	addByCategory: function(e) {
		let category = e.currentTarget.dataset.category;
		wx.navigateTo({
			url: "/pages/home_center/timer_edit/index?createTimer=" + 1 + "&device_id=" + this.data
				.device_id + "&device_name=" + this.data.device_name + "&categoty=" + category
		})
	},
	onChangeCategoryStatus:async function(event){
		let category = event.currentTarget.dataset.category;
		let group_id = event.currentTarget.dataset.groupid;
		let status = event.currentTarget.dataset.status==1?0:1;
		await editStatusByCategory(this.data.device_id,group_id,category,status)
		this.getTimers();
		
	},
	showDaysDetails(){
		this.showDetails(0);
	},
	showHoursDetails(){
		this.showDetails(1);
	},
	showDetails(type){
		let device_id = this.data.device_id;
		let device_name = this.data.device_name;
		wx.navigateTo({
			url:"/pages/home_center/ele_statistic/index?device_id="+device_id+"&device_name="+device_name+"&type="+type
		})
	}
})
