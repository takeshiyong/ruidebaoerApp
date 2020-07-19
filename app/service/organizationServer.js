import request from '../utils/request';

export default  {
  //查询全部规章制度类型信息
  securitySystemType: () => request.get(`/basis-security-service/securitySystemType/selectAll`),
  //App规章制度搜索
  securitySystemItem: (params) => request.post(`/basis-security-service/securitySystem/appSearch`, params),
  //查询安全目标年份以及数量
  selectTargetYear: () => request.get(`/basis-security-service/securityTarget/selectTargetYear`),
  //App搜索安全目标责任书
  appSelectByPage: (params) => request.post(`/basis-security-service/securityTarget/appSelectByPage`, params),
  //根据id查询安全目标信息
  securityTargetSelectById: (fId) => request.get(`/basis-security-service/securityTarget/selectById/${fId}`),

};

