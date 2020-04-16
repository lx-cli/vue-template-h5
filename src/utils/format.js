/*
 * @Date: 2020-03-04 17:36:25
 * @LastEditors: shawlee
 * @LastEditTime: 2020-03-04 18:57:15
 */
function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

/**
 * date转字符串
 * @param type 1、年月日时分；2、年月日；3、年月日时分秒
 * @param connector 年月日连接符（默认为‘.’）
 */
export function formatTime(date, type, connector = '.') {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join(connector)
  const t2 = [hour, minute, second].map(formatNumber).join(':')
  const t3 = [hour, minute].map(formatNumber).join(':')

  if (type === 1) {
    return `${t1} ${t3}`
  } else if (type === 2) {
    return t1
  } else {
    return `${t1} ${t2}`
  }
}

/**
 * 格式化日期
 * @param  {[type]} date [description]
 * @param  {String} fmt  [description]
 * @return {[type]}      [description]
 */
export function format(val, fmt = "yyyy-MM-dd") {
  if (!val) return '';
  let dateVal = val;
  if (typeof val === 'string') {
    val = val.replace(/-|\./g, '/')
  }
  let date = new Date(dateVal);
  if (typeof date !== "object") return date;
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
}

/**
 * 时间格式化
 * @param {*} time 
 * @param {*} cFormat 
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * 
 * @param {*} time 
 * @param {*} option 
 */
export function formatTimeStr(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * 获取后几个月日期
 * @param {String} date 
 * @param {Number} monthNum 
 * @return {String}
 */
export function getNextMonthDay(date, monthNum) {
  let dateArr = formatTime(date, 2, '/').split('/');
  let year = dateArr[0]; //获取当前日期的年份
  let month = dateArr[1]; //获取当前日期的月份
  let day = dateArr[2]; //获取当前日期的日
  // let days = new Date(year, month, 0);
  date = date.getDate(); //获取当前日期中的月的天数
  let year2 = year;
  let month2 = parseInt(month) + parseInt(monthNum);
  if (month2 > 12) {
    year2 = parseInt(year2) + parseInt((parseInt(month2) / 12 == 0 ? 1 : parseInt(month2) / 12));
    month2 = parseInt(month2) % 12;
  }
  // let days2 = new Date(year2, month2, 0);
  // days2 = days2.getDate();
  // /*计算当前几号*/
  // let day2 = day;
  // console.log(days2)
  // if (day2 > days2) {
  //     day2 = days2;
  // }
  if (month2 < 10) {
    month2 = '0' + month2;
  }
  // let t2 = year2 + '/' + month2 + '/' + days2;
  let t2 = new Date(year2, month2, day);
  console.log(year2, month2, day)
  return t2;
}

/**
 * 获取前几个月日期
 * @param {Date} date 
 * @param {Number} monthNum 
 * @return {Date} 
 */
export function getPreMonthDay(date, monthNum) {
  let dateArr = date.split('/');
  let year = dateArr[0]; //获取当前日期的年份
  let month = dateArr[1]; //获取当前日期的月份
  let day = dateArr[2]; //获取当前日期的日
  let days = new Date(year, month, 0);
  days = days.getDate(); //获取当前日期中月的天数
  let year2 = year;
  let month2 = parseInt(month) - monthNum;
  if (month2 <= 0) {
      year2 =parseInt(year2) -parseInt(month2 / 12 == 0 ? 1 : Math.abs(parseInt(month2 / 12)) + 1)
      month2 = 12 - (Math.abs(month2) % 12);
  }
  let day2 = day;
  let days2 = new Date(year2, month2, 1);
  days2 = days2.getDate();
  if (day2 > days2) {
      day2 = days2;
  }
  if (month2 < 10) {
      month2 = '0' + month2;
  }
  let t2 = year2 + '/' + month2 + '/' + days2;
  return t2;
}
