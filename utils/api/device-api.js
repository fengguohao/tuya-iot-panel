import request from '../request'
// request 做了自动向params中添加uid的操作，因此可以不带入uid

// 获取mqtt配置
export const getMqttconfig = () => {
  return request({
    name: 'ty-service',
    data: {
      action: 'device.openHubConfig',
      params: {
        link_id: Math.random()
          .toString(10)
          .substring(2, 11),
        link_type: 'websocket'
      }
    }
  })
}

// 获取设备列表 
export const getDeviceList = () => {
  return request({
    name: 'ty-service',
    data: {
      action: 'device.getDeviceList',
      params: {}
    }
  })
}

// 获取设备最新状态
export const getDeviceStatus = (device_id) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'device.status',
      params: {
        device_id
      }
    }
  })
}

// 获取设备指令集
export const getDeviceSpecifications = (device_id) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'device.specifications',
      params: {
        device_id
      }
    }
  })
}

// 获取设备指令集(带中文dp名称)
export const getDevFunctions = (device_id) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'device.functions',
      params: {
        device_id
      }
    }
  })
}

// 获取设备指令集(带中文dp名称)
export const getDeviceDetails = (device_id) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'device.details',
      params: {
        device_id
      }
    }
  })
}


// 指令下发
export const deviceControl = (device_id, code, value) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'device.control',
      params: {
        device_id,
        commands: [
          {
            code,
            value
          }
        ]
      }
    }
  })
}

// 获取 ticket
export const reqTicket = () =>
  request({
    name: 'ty-service',
    data: {
      action: 'system.userTicket',
      params: {}
    }
  });

export const getFullElectricity=(device_id,code)=>{
  return request({
    name:"ty-service",
    data:{
      action: 'statistics.total',
      params:{
        device_id,
        code
      }
    }
  })
}

export const getPerHoursElectricity=(device_id,code,start_hour,end_hour)=>{
  return request({
    name:"ty-service",
    data:{
      action: 'statistics.hours',
      params:{
        device_id,
        code,
        start_hour,
        end_hour
      }
    }
  })
}

export const getPerDaysElectricity=(device_id,code,start_day,end_day)=>{
  return request({
    name:"ty-service",
    data:{
      action: 'statistics.days',
      params:{
        device_id,
        code,
        start_day,
        end_day
      }
    }
  })
}

export const ctrlSocketWorkStatus=(device_id,code,value)=>{
  return deviceControl(device_id,code,value);
}

export const getAllStatus=(device_id)=>{
  return request({
    name:"device.specifications",
    data:{
      device_id
    }
  })
}

export const getDeviceCountdown=(device_id)=>{
  return request({
    name:"ty-service",
    data:{
      "action": "timer.list",
      "params": {
        device_id
    }
    }
  })
}

export const addDeviceTimer=(device_id,loops,category,functions,date,time)=>{
  return request({
    name:"ty-service",
    data:{
      "action": "timer.add",
      "params": {
        device_id,
        loops,
        category,
        "timezone_id":"Asia/Shanghai",
        "time_zone":"+8:00",
        "instruct":[
            {
                functions,
                date,
                time
            }
        ]
      }
    }
  })
}
export const testInterface=(action,params)=>{
  return request({
    name:"ty-service",
    data:{
      action,
      params
    }
  })
}


export const editTimer=(device_id,group_id,loops,category,instruct)=>{
  return request({
    name:"ty-service",
    data:{
      'action':'timer.edit',
      'params':{
		  device_id,
		  group_id,
		  loops,
		  "time_zone":"+08:00",
		  "timezone_id":"Asia/ShangHai",
		  category,
		  instruct
	  }
    }
  })
}

export const getTimerByCategory=(device_id,category)=>{
  return request({
    name:"ty-service",
    data:{
      'action':'timer.listByCategory',
      'params':{
		  device_id,
		  category,
	  }
    }
  })
}


export const deleteByCategory=(device_id,category)=>{
  return request({
    name:"ty-service",
    data:{
      'action':'timer.deleteByCategory',
      'params':{
		  device_id,
		  category,
	  }
    }
  })
}

export const deleteByGroupid=(device_id,category,group_id)=>{
  return request({
    name:"ty-service",
    data:{
      'action':'timer.deleteByGroup',
      'params':{
		  device_id,
		  category,
		  group_id
	  }
    }
  })
}

export const editStatusByCategory=(device_id,group_id,category,status)=>{
  return request({
    name:"ty-service",
    data:{
      'action':'timer.status',
      'params':{
		  device_id,
		  group_id,
		  category,
		  status
	  }
    }
  })
}