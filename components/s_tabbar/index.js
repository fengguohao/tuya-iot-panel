// components/s_tabbar/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        pageList:Array,
        active:Number,
        onChangeFunc:Object
    },
  
    /**
     * 组件的初始数据
     */
    data: {

    },
  
    lifetimes: {
        attached:function(){
            console.log(this.properties.active,this.properties.onChangeFunc)
        }
    },
  
    /**
     * 组件的方法列表
     */
    methods: {
        onChange(e){
            this.properties.onChangeFunc.onChange(e);
        }
    }
  })
  