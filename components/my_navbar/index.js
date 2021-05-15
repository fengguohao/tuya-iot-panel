// components/my_navbar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title:String,
        workStatus:Boolean,
        msg:String
    },

    /**
     * 组件的初始数据
     */
    data: {
      tagcolor:"#009ad6",
    },
    lifetimes: {
      attached:function(){
        if(this.properties.workstatus){
          //正常运行，显示蓝色标记
          this.setData({
            tagcolor:"#009ad6"
          });
        }
        else{
          this.setData({
            //未正常运行，显示红色标记
            tagcolor:"#f2826a"
          });
        }
      },
    },
    

    /**
     * 组件的方法列表
     */
    methods: {
        turnBack: function () {
            wx.navigateBack({
              delta: 1,
            })
          },
        
    }
})
