import {getTimerByCategory,editTimer,addDeviceTimer} from '../../../utils/api/device-api'
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		device_id: '',
		device_name:'',
		groupEditable: true,
		groupname:"默认组",
		repeatCollapse: '',
		dataCollapse:'',
		timeCollapse:'',
		switchCollapse:'',
		countdownCollapse:'',
		repeatStatus: false,
		repeatList: [],
		weekList: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
		readableRepeatStr:'',
		loopStr:'0111110',
		isRepeat:false,
		currentDate: new Date().getTime(),
		minDate: new Date().getTime(),
		formatter(type, value) {
		  if (type === 'year') {
			return `${value}年`;
		  } 
		  if (type === 'month') {
			return `${value}月`;
		  }
		  return value;
		},
		currentTime:'12:00',
		countDownTime:'00:00',
		switchStr:'开启插座',
		switchIdx:1,
		switchList:['保持现状','开启插座','关闭插座'],
		countDown:0
		
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function(options) {
		
		//options所包含的项目
		/**
		 * device_id
		 * device_name
		 * createTimer = 1(添加)/0(修改)
		 * //修改
		 * group_id
		 * category
		 */
		this.setData({
			device_id:options.device_id,
			device_name:options.device_name,
			createTimer:options.createTimer
		})
		let title = '添加定时任务';
		let groupEditable=true;
		let groupname='默认组';
		if(options.category!=undefined){
			groupname=options.category;
			groupEditable=false;
		}
		this.setData({
			groupEditable,
			groupname
		})
		//修改项目
		if(options.createTimer==0){
			
			title = '修改定时任务'
			let a=await getTimerByCategory(options.device_id,options.category);
			let groupIdx = 0;
			for(let i in a.groups){
				if(options.group_id==a.groups[i].id){
					groupIdx=i;
					break;
				}
			}
			let currentDate=new Date().getTime();
			if(a.groups[groupIdx].timers[0].loop!="0000000"){
				currentDate=this.generateCurrentDate(a.groups[groupIdx].timers[0].date);
			}
			
			let dateStr = this.toReadableDateStr(currentDate);
			let switchIdx=0;
			let countDownTime='00:00';
			let countDownStr="定时器关闭";
			let countDown=0;
			for(let i in a.groups[groupIdx].timers[0].functions){
				if("switch"==a.groups[groupIdx].timers[0].functions[i].code){
					if(a.groups[groupIdx].timers[0].functions[i].value==true){
						switchIdx=1;
					}else{
						switchIdx=2;
					}
				}
				if("countdown_1"==a.groups[groupIdx].timers[0].functions[i].code){
					if(a.groups[groupIdx].timers[0].functions[i].value==0){
						countDownTime='00:00';
						countDownStr="定时器关闭";
					}else{
						countDown=a.groups[groupIdx].timers[0].functions[i].value;
						let timeSec = a.groups[groupIdx].timers[0].functions[i].value;
						let hours=Math.floor(timeSec/3600)+'';
						timeSec=timeSec%3600;
						let minutes = Math.floor(timeSec/60)+'';
						if(hours.length==1){
							hours='0'+hours;
						}
						if(minutes.length==1){
							minutes='0'+minutes;
						}
						countDownTime=hours+':'+minutes;
						countDownStr=countDownTime+'后执行';
					}
				}
			}
			//switch
			let currentTime=a.groups[groupIdx].timers[0].time;
			this.setData({
				currentDate,
				switchStr:this.data.switchList[switchIdx],
				currentTime,
				loopStr:a.groups[groupIdx].timers[0].loops,
				groupIdx,
				countDownTime,
				countDownStr,
				dateStr,
				switchIdx,
				countDown,
				group_id:options.group_id
			})
			
		}
		wx.setNavigationBarTitle({
			title:title
		})
		
		let repeatList = this.extractFromLoopStr(this.data.loopStr);
		let readableRepeatStr = this.generateReadableLoopStr(this.data.loopStr);
		this.setData({
			repeatList,
			readableRepeatStr
		});
		let isRepeat = true;
		if(this.data.loopStr=='0000000'){
			isRepeat=false;
		}
		this.setData({
			isRepeat
		});
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function() {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},
	toggleRepeat: function(event) {
		this.setData({
			repeatCollapse: true,
		});
	},
	toggleDate: function(event) {
		this.setData({
			dateCollapse: true,
		});
	},
	toggleTime: function(event) {
		this.setData({
			timeCollapse: true,
			
		});
	},
	toggleSwitch: function(event) {
		this.setData({
			switchCollapse: true,
		});
	},
	toggleCountdown: function(event) {
		this.setData({
			countdownCollapse: true,
		});
	},
	setSwitchStatus:function(event){
		const { picker, value, index } = event.detail;
		this.setData({
			switchStr:value,
			switchIdx:index
		})
		
	},
	generateLoopStr: function(repeatList) {
		let str = '';
		for (let i in this.data.weekList) {
			let find = false;
			for (let j in repeatList) {
				if (i == parseInt(repeatList[j])) {
					str += '1';
					find = true;
					break;
				}
			}
			if (!find) {
				str += '0';
			}
		}
		return str;
	},
	extractFromLoopStr:function(loopStr){
		let repeatList=[]
		for(let i in loopStr){
			if(loopStr[i]=='1'){
				repeatList.push(i+'')
			}
		}
		return repeatList;
	},
	generateReadableLoopStr:function(loopStr){
		let readableRepeatStr = '';
		if(loopStr=='0111110'){readableRepeatStr="周一~周五"}
		else if(loopStr=='1000001'){readableRepeatStr="周六~周日"}
		else if(loopStr=='1111111'){readableRepeatStr="每天"}
		else if(loopStr=='0000000'){readableRepeatStr='不循环'}
		else{
			for(let i in loopStr){
				if(loopStr[i]=='1'){
					readableRepeatStr+=this.data.weekList[i]+' ';
				}
			}
		}
		return readableRepeatStr;
	},
	onSetRepeat: function(event) {
		let loopStr = this.generateLoopStr(event.detail);
		let readableRepeatStr = this.generateReadableLoopStr(loopStr);
		this.setData({
			repeatList: event.detail,
			loopStr,
			readableRepeatStr
		});
		let isRepeat=true;
		if(loopStr=='0000000'){
			isRepeat=false;
		}
		this.setData({
			isRepeat
		});
		
	},
	toReadableDateStr:function(d){
		let tempD = new Date(d);
		let year = tempD.getYear()+1900;
		let month = tempD.getMonth()+1;
		let day = tempD.getDate();
		return year+'年'+month+'月'+day+'日';
	},
	onInputCategory(event){
		this.setData({
			groupname:event.detail
		})
	},
	onInputDate(event) {
		
		let year = parseInt(event.detail.getColumnValue(0).substr(0,4));
		let month = parseInt(event.detail.getColumnValue(1).substr(0,2))-1;
		let day = parseInt(event.detail.getColumnValue(2));
		let t = new Date(year,month,day).getTime();
		let dateStr = this.toReadableDateStr(t);
	    this.setData({
	      currentDate: t,
		  dateStr
	    });
	  },
	onInputTime(event){
		let t = event.detail.getColumnValue(0)+':'+event.detail.getColumnValue(1);
		this.setData({
		  currentTime: t,
		});
	},
	onInputCountDown(event){
		let hour = parseInt(event.detail.substr(0,2));
		let minute = parseInt(event.detail.substr(3,2));
		let countDownStr="定时器关闭";
		if(event.detail!='00:00'){
			countDownStr=event.detail+'后执行';
		}
		this.setData({
		  countDownTime: event.detail,
		  countDown:hour*3600+minute*60,
		  countDownStr
		});
	},
	onClosePopUp(){
		this.setData({
			dateCollapse: false,
			timeCollapse:false,
			repeatCollapse: false,
			switchCollapse:false,
			countdownCollapse:false,
		})
	},
	generateCurrentDate:function(date){
		let year = parseInt(date.substr(0,4));
		let month = parseInt(date.substr(4,2))-1;
		let day = parseInt(date.substr(6,2));
		let d = new Date(year,month,day);
		return d.getTime();
	},
	convertToDate:function(date){
		let d = new Date(date);
		let year = d.getFullYear()+'';
		let month = d.getMonth()+1+'';
		let day = d.getDate()+'';
		if(month.length==1){
			month='0'+month;
		}
		if(day.length==1){
			day='0'+day;
		}
		return year+month+day;
	},
	turnBack:function(){
		Dialog.confirm({
			title: '确认要返回吗？',
		})
		.then(() => {
			wx.navigateBack();
		}).catch(()=>{})
		
	},
	saveTimer:async function(){
		Dialog.confirm({
			title: '确认要保存该任务吗？',
		})
		.then(async () => {
			if(this.data.countDown==0&&this.data.switchIdx==0){
				 wx.showToast({
				   title:"未设置任何行为",
				   icon: 'error',//图标，支持"success"、"loading" 
				   duration: 2000,//提示的延迟时间，单位毫秒，默认：1500 
			
				})
			}
			let instruct=[]
			let instructObj={}
			if(!this.data.isRepeat){
				instructObj.date=this.convertToDate(this.data.currentDate);
			}
			instructObj.time=this.data.currentTime;
			let functions=[]
			if(this.data.countDown!=0){
				let f = {};
				f.code="countdown_1";
				f.value=this.data.countDown;
				functions.push(f);
			}
			if(this.data.switchIdx!=0){
				let f = {};
				f.code="switch";
				f.value=this.data.switchIdx==1?true:false;
				functions.push(f);
			}
			instructObj.functions=functions;
			instruct.push(instructObj);
			if(this.data.createTimer==0){
				await editTimer(this.data.device_id,this.data.group_id,this.data.loopStr,this.data.groupname,instruct)
			}else{
				await addDeviceTimer(this.data.device_id,this.data.loopStr,this.data.groupname,functions,instructObj.date,instructObj.time)
			}
			getCurrentPages().slice(-2)[0].getTimers();
			wx.navigateBack();
		})
		.catch(()=>{})
		
	}
})
