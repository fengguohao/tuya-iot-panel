// pages/home_center/common_panel/components/Enum/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: String,
    dpCode: String,
    dpName: String,
    values: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    range: []
  },

  lifetimes: {
    attached: function () {
      const { values } = this.properties
      console.log(values)
      const { range } = values ? JSON.parse(values) : { range: [] };
      this.setData({ range }) 
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange: function (event) {
      const { dpCode } = this.properties
      const { dataset: { value } } = event.currentTarget
      this.triggerEvent('sendDp', { dpCode, value })
    }
  }
})
