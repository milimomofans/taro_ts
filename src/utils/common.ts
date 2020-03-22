import Taro from '@tarojs/taro'
import round from 'lodash/round'

export function assert(condition: any, msg: string): void {
  if (!condition) {
    throw new Error(`[Apior] ${msg}`)
  }
}

function insertZeroBf(val) {
  const copy = parseInt(val, 10)
  if (Number.isNaN(copy)) {
    return copy
  }
  return copy < 10 ? `0${copy}` : copy
}

function days(day: number) {
  if (day > 0 && typeof day === 'number') {
    return day * 24 * 60 * 60 * 1000
  }
  return 0
}
export function transTimeToLocal(val: { startTime: string; endTime: string }) {
  // console.log(val)
  const week = ['日', '一', '二', '三', '四', '五', '六']
  if (!val || !val.startTime || !val.endTime) {
    return '未知时间, 请电话咨询'
  }
  const startTime = new Date(parseInt(val.startTime, 10) * 1000)
  const endTime = new Date(parseInt(val.endTime, 10) * 1000)
  // console.log(startTime, endTime)
  const now = new Date()
  let calculateTime: Date
  let absolutTime: number
  let kind = ''
  if (now > startTime && now <= endTime) {
    absolutTime = Math.abs(endTime.getTime() - now.getTime())
    calculateTime = endTime
    kind = '结束'
  } else if (now <= startTime) {
    absolutTime = Math.abs(startTime.getTime() - now.getTime())
    calculateTime = startTime
    kind = '开始'
  } else {
    return '已结束'
  }
  if (absolutTime < days(1) && now.getDate() === calculateTime.getDate()) {
    return `今天 ${insertZeroBf(calculateTime.getHours())}:${insertZeroBf(
      calculateTime.getMinutes()
    )} ${kind}`
  } else if (
    absolutTime < days(2) &&
    (calculateTime.getDay() - now.getDay() === 1 ||
      calculateTime.getDay() - now.getDay() === -6)
  ) {
    return `明天 ${insertZeroBf(calculateTime.getHours())}:${insertZeroBf(
      calculateTime.getMinutes()
    )} ${kind}`
  } else if (
    calculateTime.getDay() - now.getDay() < 6 &&
    calculateTime.getDay() - now.getDay() > 0 &&
    absolutTime < days(6) &&
    now.getDay() !== 0 &&
    calculateTime.getDay() !== 0
  ) {
    return `本周${week[calculateTime.getDay()]} ${insertZeroBf(
      calculateTime.getHours()
    )}:${insertZeroBf(calculateTime.getMinutes())} ${kind}`
  } else if (absolutTime < days(7) && calculateTime.getDay() === 0) {
    return `本周日${insertZeroBf(calculateTime.getHours())}:${insertZeroBf(
      calculateTime.getMinutes()
    )} ${kind}`
  } else if (absolutTime > days(14)) {
    return `${calculateTime.getFullYear()}.${insertZeroBf(
      calculateTime.getMonth() + 1
    )}.${insertZeroBf(calculateTime.getDate())} ${insertZeroBf(
      calculateTime.getHours()
    )}:${insertZeroBf(calculateTime.getMinutes())} ${kind}`
  } else {
    return `下周${week[calculateTime.getDay()]} ${insertZeroBf(
      calculateTime.getHours()
    )}:${insertZeroBf(calculateTime.getMinutes())} ${kind}`
  }
}
export function valideTime(stime, etime) {
  if (!stime || !etime) {
    return
  }
  return transTimeToLocal({
    startTime: stime,
    endTime: etime
  })
    .replace('开始', '可用')
    .replace('结束', '过期')
}
// 拨打电话
export function makeCall(phone: string): Promise<any> {
  return Taro.makePhoneCall({
    phoneNumber: phone
  })
}

export function formatPassTime(startTime) {
  const currentTime = new Date().getTime()
  const time = currentTime - startTime
  const day = round(time / (1000 * 60 * 60 * 24))
  const hour = round(time / (1000 * 60 * 60))
  const min = round(time / (1000 * 60))
  const month = round(day / 30)
  const year = round(month / 12)
  if (year) {
    return year + '年前'
  }
  if (month) {
    return month + '个月前'
  }
  if (day) {
    return day + '天前'
  }
  if (hour) {
    return hour + '小时前'
  }
  if (min) {
    return min + '分钟前'
  } else {
    return '刚刚'
  }
}

export const transKeyToCamel = (key: string) => {
  if (typeof key === 'string') {
    const list = key.split('_')
    if (list.length === 1) {
      return key
    } else {
      return list
        .map((item, i) => {
          if (i === 0) {
            return item
          } else {
            return item.replace(/^\S/, s => {
              return s.toUpperCase()
            })
          }
        })
        .join('')
    }
  } else {
    return key
  }
}
let count = 0

export function goLocation(
  lat: number,
  lng: number,
  name: string,
  address: string
) {
  return Taro.getLocation({
    type: 'wgs84',
    success() {
      // 使用微信内置地图查看位置。
      Taro.openLocation({
        // 要去的纬度-地址
        latitude: lat,
        // 要去的经度-地址
        longitude: lng,
        name,
        address
      })
    },
    fail() {
      if (count > 0) {
        Taro.getSetting().then(res => {
          const authSetting = res.authSetting
          if (authSetting['scope.userLocation']) {
            Taro.openLocation({
              // 要去的纬度-地址
              latitude: lat,
              // 要去的经度-地址
              longitude: lng,
              name,
              address
            })
          } else {
            Taro.showModal({
              title: '用户未授权',
              content:
                '如需正常使用导航功能，请按确定并在授权管理中选中“使用我的地理位置”，然后点按确定。最后再重新进入小程序即可正常使用。',
              showCancel: true,
              success(result) {
                if (result.confirm) {
                  Taro.openSetting({
                    success: function success(data) {
                      if (data.authSetting['scope.userLocation']) {
                        Taro.openLocation({
                          // 要去的纬度-地址
                          latitude: lat,
                          // 要去的经度-地址
                          longitude: lng,
                          name,
                          address
                        })
                      }
                    }
                  })
                }
              },
              fail() {}
            })
          }
        })
      } else {
        count++
      }
    }
  })
}

export function getRemainTime(endTime, serviceTime?) {
  const now = serviceTime || Date.parse(new Date().toString())
  // let t = endTime - Date.parse(new Date()) - serverTime + deviceTime
  const t = endTime - now
  const seconds = Math.floor((t / 1000) % 60)
  const minutes = Math.floor((t / 1000 / 60) % 60)
  let hours = Math.floor((t / (1000 * 60 * 60)) % 24)
  const day = Math.floor(t / (1000 * 60 * 60 * 24))
  if (day > 0) {
    hours += day * 24
  }
  return {
    total: t,
    days: day,
    hours: insertZeroBf(hours),
    minutes: insertZeroBf(minutes),
    seconds: insertZeroBf(seconds)
  }
}
