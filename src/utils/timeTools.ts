function remain2String(value) {
  let nowValue = value
  if (+nowValue < 0) {
    nowValue = 0
  }
  if (+nowValue < 10) {
    return `0${nowValue}`
  }
  return nowValue
}

// 获取距离当前时间还有多久
export function getRemainTime(endTime) {
  let nowTime
  if (typeof endTime === 'number' && endTime.toString().length < 13) {
    nowTime = endTime * 1000
  } else {
    nowTime = endTime
  }
  const t = nowTime - new Date().getTime()
  const seconds = Math.floor((t / 1000) % 60)
  const minutes = Math.floor((t / 1000 / 60) % 60)
  const hours = Math.floor((t / (1000 * 60 * 60)) % 24)
  const days = Math.floor(t / (1000 * 60 * 60 * 24))
  let totalHours = hours
  if (days > 0) {
    totalHours += days * 24
  }
  return {
    total: t,
    days,
    totalHours,
    hours: remain2String(hours),
    minutes: remain2String(minutes),
    seconds: remain2String(seconds),
    timeString: `${remain2String(minutes)}:${remain2String(seconds)}`
  }
}
