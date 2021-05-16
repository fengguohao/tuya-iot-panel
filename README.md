This project is developed using Tuya SDK, which enables you to quickly develop branded apps connecting and controlling smart scenarios of many devices.  

For more information, please check Tuya Developer Website.

# tuya-iot-panel

[英文版]: ./README.en.md



这是涂鸦IOT智能单插面板微信小程序项目


Demo 中心开发者作品中心涂鸦iot-智能单插小程序

# 涂鸦iot-智能单插小程序

更新时间：2021-05-16 20:29:27阿根廷之神

## 概况

本项目基于涂鸦SDK，使用微信小程序作为主要的开发技术实现了对智能插座的管理。

github链接：https://github.com/fengguohao/tuya-iot-panel

bilibili视频介绍：https://www.bilibili.com/video/BV1ib4y1f7Hr/

## 实现的主要功能

- 添加设备（设备配网）
- 设备状态查看
- 设备控制（控制设备开启/关闭，倒计时开启/关闭）
- 电量报表（按小时/天统计电量并已图表/列表形式展现）
- 定时管理
- 家庭管理

## 部分界面展示

![img](https://images.tuyacn.com/developer/community/1621165428da4b8ccb043.png)![img](https://images.tuyacn.com/developer/community/1621165445d19af91b598.png)![img](https://images.tuyacn.com/developer/community/1621165457807530931e1.png)![img](https://images.tuyacn.com/developer/community/162116547002d981ca303.png)![img](https://images.tuyacn.com/developer/community/1621165486c0de0ebb5ba.png)

作品视频展示: https://www.bilibili.com/video/bv1ib4y1f7Hr

## 物料清单

硬件 (1)软件 (1)

- 

  #### Wi-Fi智能插座 计量版

  数量：1

  具备开关、定时和电量检测功能

## 步骤

## 1. 注册微信小程序和开发账号

要开发微信小程序，就需要有一个微信小程序账号用来开发，可以去微信小程序官网注册(https://mp.weixin.qq.com/cgi-bin/wx?token=&lang=zh_CN)，注册个人账号即可

## 2.在涂鸦官网创建微信小程序并配置云环境

![img](https://images.tuyacn.com/developer/community/1621166452eb5837f71ba.png)[涂鸦小程序](https://iot.tuya.com/oem/miniprogram)链接

涂鸦小程序的开发机制是使用腾讯云开发cloudbase部署云环境，微信小程序访问cloudbase上的云服务实现的，所以创建小程序时要先完成环境部署，然后获取插件权限。 完成上述步骤后就可以下载demo进行体验及开发了。

## 3.在微信开发者工具中完成开发

开发这一步不详细叙述了，可以登陆微信开放文档查看。 简单介绍开发中使用的技术。

### 组件化开发及组件库

微信小程序提供了组件开发(component)的能力，可以将页面拆分为不同的组件来开发，再像搭积木一样把组件组装起来形成页面。这样的方案极大提高了代码的可复用性，降低开发成本，提高效率。 进一步的，现在也有成熟好用的组件库可以使用，vant就是其中之一。作为有赞团队开发的前端组件库，它包括了我们在开发中所需要的大部分组件，可以进一步降低开发难度。 在使用vant组件库时，我们可以使用npm来进行管理，使用npm进行管理也是前端工程化的发展趋势。

### 图表展示实现

要实现图表功能，可以使用现有图表库来开发，对于微信小程序，echarts和wx-charts是两个不错的工具，相比来说echarts功能更全面，但包库体积也更大，在选择时可以根据需求灵活选用。

### 微信小程序分包加载机制

微信小程序开发有包大小限制，单包最大不超过2M，在开发过程中发现涂鸦配网插件大小就接近1M，总包大小远超2M，无法正常完成打包发布的过程。

对于这个问题有两个解决方案：

1. 尽可能减少资源体积，使用oss图床存储图片资源，减小空间占用。
2. 分包。

分包加载技术的最初想法是把不常用且较大的资源/页面放到分包之中，用户需要这些资源时再下载，而不再是在首次加载的时候就完全下载，这样做有助于缩短小程序启动的首屏时间，优化体验。

而对于我们的开发项目，分析后发现，配网插件就属于不常用的部分，将这部分移动到分包之中，便能解决资源空间限制问题。

需要注意的是，微信小程序要求单包大小最大不超过2M，总包大小不超过10M，灵活使用分包技术便可以符合其技术要求。

### 其他

小程序开发过程中还涉及其他技术知识，如mqtt协议，云函数等，不再详述，可以通过微信官方文档，涂鸦SDK文档等查询到，在这里附上涂鸦SDK文档的链接以供查阅。

[sdk文档](https://developer.tuya.com/cn/docs/iot/applet-ecology?id=K9ptacgp94o5d)

## 小结

微信小程序作为轻量级应用，能够更好地吸纳用户，快速铺开服务，对于IOT设备开发具有天然优势，在这一点上涂鸦SDK很好地满足了开发者的需要，推荐大家体验学习