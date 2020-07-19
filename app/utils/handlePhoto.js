import moment from 'moment';
/**
 * 处理后台返回的附件，照片，视频数据结构
 */
export function handlePhotoToJs(photoArr) {
  let arr = [];
  if (!photoArr) {
      return arr;
  }
  for (let obj of photoArr) {
    arr.push({
      id: obj.fId,
      type: obj.fType,
      fileName: obj.fFileName,
      status: 'success',
      path: obj.fFileLocationUrl
    });
  }
  return arr;
}

// 时间转换
export function parseDate(data, format = 'YYYY-MM-DD HH:mm') {
    if (!data) {
        return '--';
    }
    if (!isNaN(data)) {
        return moment(data).format(format);
    }
    return moment(data.replace(/-/g, '/')).format(format);
}
// 转换时间戳
export function parseTime(data) {
    if (!data) {
        return '';
    }
    return new Date(data.replace(/-/g, '/')).getTime();
}

 //判断是不是小数
 export function isDot(num){
  var result = String(num).indexOf('.');
  if(result !== -1) {
      return num.toFixed(2)
  }else{
      return num
  }
}