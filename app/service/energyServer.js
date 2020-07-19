import request from '../utils/request';


export default  {
    //获取产量概览
    getSurvey: () => request.get(`/production-service/outPut/selectPhone`),
    //获取销量概览
    getVolume: () => request.post(`/production-service/SaleOut/AppSaleTotal`),
    //获取产量统计各类型的量
    getOutPutStatistics: (params) => request.post(`/production-service/outPut/outPutStatistics`,params),
    //获取销量统计各类型及数据
    getSalesVolumeStatistics: (params) => request.post(`/production-service/SaleOut/HttpAPPSaleByDerOrType`,params),
    //获取能耗概览
    getEnergy: () => request.get(`/production-service/energy/selectPhone`),
    //获取能耗统计饼图图
    getConsume: (params) => request.post(`/production-service/energy/energyConsume`,params),
    //获取能耗统计折线图
    getConsumeByTime: (params) => request.post(`/production-service/energy/energyConsumeByTime`,params),
    //首页产能获取
    getSelectAll: (params) => request.post(`/production-service/statistical/selectAll`,params),

  };
  