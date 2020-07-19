import request from '../utils/request';

export default  {
    //分页查询监测点
  getSelectByPage: (params) => request.post(`/environment-security-service/monitor/selectbypage`, params),
    //监测点监测数据
  getControllerData: (monitorId) => request.get(`/environment-security-service/monitordata/selectlastrecord/${monitorId}`),
    //统计监测点数据
  getStatistics : (params) => request.post(`/environment-security-service/monitordata/statistics`,params)
};
