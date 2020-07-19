import request from '../utils/request';

export default  {
  // 获取全部隐患级别
  getTroubleLevel: () => request.get(`/production-security-service/hiddenTroubleLevel/selectAll`),
  // 获取全部隐患类型
  getTroubleType: () => request.get(`/production-security-service/hiddenTroubleType/selectAll`),
  // 随手拍新添隐患
  commitTroubleByPhote: (params) => request.post(`/production-security-service/hiddenTrouble/insert`, params),
  // 隐患列表查询
  getTroubleList: (params) => request.post(`/production-security-service/hiddenTrouble/selectByPage`, params),
  // 获取隐患详情通过fId
  getTroubleDetailById: (params) => request.get(`/production-security-service/hiddenTrouble/selectHiddenTroubleInfoById/${params}`),
  // 隐患处理审核
  troubleAudit: (params) => request.post(`/production-security-service/hiddenTrouble/audit`, params),
  // 隐患处理研判
  troubleHiddenTrouble: (params) => request.post(`/production-security-service/hiddenTrouble/readHiddenTrouble`, params),
  // 确认接受隐患整改任务
  confirmHiddenTrouble: (params) => request.post(`/production-security-service/hiddenTrouble/confirmHiddenTrouble`, params),
  // 拒绝隐患整改任务
  rejectHiddenTrouble:  (params) => request.post(`/production-security-service/hiddenTrouble/rejectHiddenTrouble`, params),
  // 整改完成整改任务
  finishHiddenTrouble: (params) => request.post(`/production-security-service/hiddenTrouble/finishHiddenTrouble`, params),
  // 复查隐患
  reviewHiddenTrouble: (params) => request.post(`/production-security-service/hiddenTrouble/reviewHiddenTrouble`, params),
  // 发布隐患
  releaseHiddenTrouble: (params) => request.post(`/production-security-service/hiddenTrouble/releaseHiddenTrouble`, params),
  // 重复隐患积分规则
  repeatTroubleRule: (params) => request.get(`/production-security-service/HiddenIntegralRule/selectByLevelAndType/${params.fLevelId}/${params.fType}`),
  // 通过隐患id查隐患状态
  selectTroubleStateById: (params) => request.get(`/production-security-service/hiddenTrouble/selectByFId/${params}`),
  //根据隐患级别查询饼状图占比
  selectByLevel: () => request.get(`/production-security-service/hiddenTrouble/selectByLevel`),
  //根据隐患状态集合查询隐患数量
  selectNumByState: (params) => request.post(`/production-security-service/hiddenTrouble/selectNumByState`, params),
  //查询各个级别隐患数量(未处理完成)
  getSelectLevelNum: () => request.get('/production-security-service/hiddenTrouble/selectLevelNum'),
  //查询待处理、拒整改、整改中、待复查的任务数量
  getSelectStateNumber: () => request.get('/production-security-service/hiddenTrouble/selectStateNumber'),
  // 隐患撤回
  revocationTrouble: (params) => request.post(`/production-security-service/hiddenTrouble/revocationHiddenTrouble/${params}`),
  // 隐患查询相关处理人信息
  selectPeopleById: (params) => request.get(`/production-security-service/hiddenTroublePlan/selectByHiddenTroubleId/${params}`),
  // 查询日志统计隐患数量查询
  selectLogNumByLevel: (params) => request.post(`/production-security-service/hiddenTrouble/selectLogNumByLevel`, params),
  // 查询班组信息
  selectGroupClass: () => request.get(`/production-security-service/scheduling/selectAll`),
  // 查询当前部门下负责人
  selectLeadByList: (params) => request.get(`/user-service/employee/selectdutyuserbydepid/${params}`)
};

