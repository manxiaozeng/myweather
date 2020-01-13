const QQMapWX = require('../../utils/qqmap-wx-jssdk.js')
Page({
  data: {
    location_text: '北京',
    temperature: '30°',
    now_weather: '晴',
    now_air: '优',
    today: '2019-09-12',
    today_weather: '晴转多云'
  },
  onLoad: function () {
    this.qqmapsdk = new QQMapWX({
      key: 'EAXBZ-33R3X-AA64F-7FIPQ-BY27J-5UF5B'
    })
    this.getCityAndWeather()
  },
  // 获取位置及天气
  getCityAndWeather() {
    var that = this;
    wx.getLocation({
      success: res => {
        this.location_pin = res.longitude + ',' + res.latitude
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res2 => {
            let district = res2.result.address_component.district
            let city = res2.result.address_component.city
            that.setData({
              city:city,
              location_text: district,
            })
            that.getNowWeather()
          }
        })
      },
      fail: () => {
        console.log('未授权位置');
      }
    })
  },

  // 获取当前天气
  getNowWeather() {
    let that = this
    let hfkey = '3b820c451ee144629f959b464b2dd6a5'
    let url = 'https://free-api.heweather.net/s6/weather/now?key=' + hfkey + '&location=' + this.location_pin

    wx.request({
      url: url,
      success: function (res) {
        console.log('success')
        console.log(res)
        let nowData = res.data.HeWeather6[0].now;
        //温度数据
        let temperature = nowData.tmp
        //当前天气文字描述
        let now_weather = nowData.cond_txt
        // 今日日期
        var date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        that.setData({
          temperature: temperature + '°',
          now_weather: now_weather,
          today: year + '-' + month + '-' + day
        })
      },
      fail: function (res) {
        console.log()
      }
    })
  }
})
