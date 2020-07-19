import request from '../utils/request';
export default  {
    //查询全部区域信息(APP端)
  identifyVideoSelectAllArea: () => request.get(`/environment-security-service/identifyVideo/selectAllArea`),
  //根据区域id查询料径识别摄像头信息
  identifyVideoSelectByAreaId: (fAreaId) => request.get(`/environment-security-service/identifyVideo/selectByAreaId/${fAreaId}`),
  //获取最近报警列表(fHours为空时全查)
  getNearAlarmInfo: (fHours,fVideoId) => request.get(`/environment-security-service/detection/getNearAlarmInfo?fHours=${fHours}&fVideoId=${fVideoId}`),
  //料径识别报警记录查询
  selectAlarmRecordByPage: (params) => request.post(`/environment-security-service/detection/selectAlarmRecordByPage`,params),
  //根据条件查询各类型料径识别报警数
  selectAlarmTypeNumBySearch: (params) => request.post(`/environment-security-service/detection/selectAlarmTypeNumBySearch`,params),
  //获取最近报警统计
  getNearAlarmStatistical: (fVideoId) => request.get(`/environment-security-service/detection/getNearAlarmStatistical?fVideoId=${fVideoId}`),
  //查询视频摄像头分类树结构信息
  selectAreaTreeInfo: (fName) => request.get(`/environment-security-service/videoArea/selectAreaTreeInfo?fName=${fName}`),
  //分页查询对外展示资源
  displayresourcesexternally: (params) => request.post(`/environment-security-service/displayresourcesexternally/selectByPage`,params),
  //根据摄像头名称查询摄像头信息
  selectVideoInfoByName: (fName) => request.get(`/environment-security-service/videoChannelConfig/selectVideoInfoByName?fName=${fName}`),

};