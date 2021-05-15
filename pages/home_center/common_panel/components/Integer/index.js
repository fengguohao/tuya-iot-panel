// pages/home_center/common_panel/components/Integer/index.js
Component({
  options: {
    styleIsolation: 'shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    values: String,
    value: Number,
    dpName: String,
    dpCode: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    min: 1,
    step: 1,
    max: 1,
    unit: '%'
  },

  lifetimes: {
    attached: function() {
      const { values } = this.properties
      const { step, min, max, unit } = values
      ? JSON.parse(values)
      : { step: 1, min: 1, max: 1, unit: '%' };

      this.setData({ step, min, max, unit })
      console.log('values',values)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange: function(event) {
      const { dpCode } = this.properties
      const value = event.detail
      this.triggerEvent('sendDp', { dpCode, value })
    }
  }
})
