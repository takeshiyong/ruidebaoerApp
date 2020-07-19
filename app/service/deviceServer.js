import request from '../utils/request';

export default  {
  // 获取设备类型接口
  getDeviceType: () => request.get(`/device-service/equipmentTypeInfo/selectAll`),
  // 根据类型获取设备列表
  getDeviceListByType: (typeInfoId) => request.get(`/device-service/equipment/selectByTypeInfo/${typeInfoId}`),
  // 根据设备id获取设备详情
  getDeviceDetailById: (fId) => request.get(`/device-service/equipment/selectDetailsByFId/${fId}`),
  // 根据类型查询设备统计信息
  getDeviceStaticsByType: (fId) => request.get(`/device-service/equipment/selectStatistics/${fId}`),
  // 查询所有生产产商
  getDeviceManufacturerSelectAll : () => request.post(`/device-service/manufacturer/selectAll`),
  // 查询所有的设备区域
  getDeviceEquipmentAreaSelectAll : () => request.post(`/device-service/area/selectAll`),
  // 查询所有设备型号
  getDeviceEquipmentTypeModelSelectAll : () => request.post(`/device-service/typeModel/selectAll`),
  // 查询所有设备级别
  getDeviceEquipmentLevelSelectAll : () => request.post(`/device-service/level/selectAll`),
  // 分页查询巡检线路
  getCheckUpList: (param) => request.post(`/device-security-service/patrolRoute/app/pageSelectListByCondition`, param),
  // 根据区域id查询设备列表
  getDeviceListByArea: (fId) => request.get(`/device-service/equipment/selectByArea/${fId}`),
  // 创建巡检路线
  createDeviceRoute: (param) => request.post(`/device-security-service/patrolRoute/insert`, param),
  // 查询巡检线路详情
  selectRouteDetail: (fId) => request.post(`/device-security-service/patrolRoute/selectDetailsByfPatrolRouteId/${fId}`),
  // 查询巡检线路详情new 
  selectDetailsByfPatrolTaskId: (fId) => request.get(`/device-security-service/equipmentPatrolTask/selectDetailsByfPatrolTaskId/${fId}`),
  // 删除巡检路线
  deleteRoute: (fId) => request.post(`/device-security-service/patrolRoute/deleteById/${fId}`),
  // 编辑线路
  updateRoute: (param) => request.post(`/device-security-service/patrolRoute/update`, param),
  // 设备查检查项
  selectCheckItemByFid: (fId) => request.get(`/device-security-service/equipmentCheckItems/selectCheckItemsByfEquipmentId/${fId}`),
  // 全查巡检路线
  selectRouteAll: (param) => request.post(`/device-security-service/patrolRoute/selectListByCondition`, param),
  // 分页条件查询巡检任务
  selectCheckUpListByPage: (param) => request.post(`/device-security-service/equipmentPatrolTask/page/selectListByCondition`, param),
  // 条件查询巡检任务list
  selectCheckUpList: (param) => request.post(`/device-security-service/equipmentPatrolTask/selectListByCondition`, param),
  // 查询巡检任务详情ById
  selectCheckUpDetailById: (fId) => request.get(`/device-security-service/equipmentPatrolTask/selectDetailsByfPatrolTaskId/${fId}`),
  // 查询当前巡检任务状态
  selectCheckUpTaskStatus: (fId) => request.get(`/device-security-service/patrolRecord/selectInProgressPatrolRecord/${fId}`),
  // 开启新一轮巡检
  openNewTask: (fId) => request.post(`/device-security-service/patrolRecord/insert/${fId}`),
  //根据设备类型id查询属性信息
  getEquipmentAttribute: (fId) => request.get(`/device-service/equipmentAttribute/selectByTypeId/${fId}`),
  //添加设备
  addDevice : (params) => request.post(`/device-service/equipment/add`,params),
  //查询全部维修类型信息
  getMaintenanceType: () => request.get(`/device-security-service/maintenanceType/selectAll`),
  //新增设备维修记录
  addInsertRecord : (params) => request.post(`/device-security-service/equipmentbMaintenancePlan/insertRecord`,params),
  // 创建一条巡检任务
  createCheckUpTask: (param) => request.post(`/device-security-service/equipmentPatrolTask/insert`, param),
  //分页查询设备维修记录
  getMaintenanceRecord : (params) => request.post(`/device-security-service/equipmentbMaintenancePlan/selectByPage`,params),
  //查询所有设备
  getAllDevice: () => request.get(`/device-service/equipment/selectAll`),
  //查询满足条件的各个维修类型下的维修记录数量
  getMaintenanceSelectNum : (params) => request.post(`/device-security-service/equipmentbMaintenancePlan/selectNumByType`,params),
  //根据维修记录id查询维修记录详情
  getDetailByFid: (fId) => request.get(`/device-security-service/equipmentbMaintenancePlan/selectById/${fId}`),
  // 查询单设备单任务的设备检查项
  getCheckItemsByEqumentId: (param) => request.post(`/device-security-service/patrolEquipment/equipmentInformation`, param),
  // 提交设备巡检检查项
  commitCheckUp: (param) => request.post(`/device-security-service/patrolEquipment/patrolEquipmentRecord`, param),
  //条件查询巡检记录列表（不传默认全查）
  getPageDetail: (params) => request.post(`/device-security-service/patrolRecord/selectListByCondition`,params),
  //查询该任务下所有设备的异常项  	 
  getErrorDetail:(patrolRecordId) => request.get(`/device-security-service/patrolEquipment/exceptionItem/${patrolRecordId}`),
  // 查询任务下的暂存列表
  getTaskTempList: (fId) => request.get(`/device-security-service/patrolEquipment/selectTemporary/${fId}`),
  //分页查询登录人保养任务列表
  selectListByLoginUserIdAndLevel: (params) => request.post(`/device-security-service/maintainTask/page/selectListByLevel`,params),
  //查询保养任务详情
  selectDetailByfMaintainTaskId:(fMaintainTaskId) => request.get(`/device-security-service/maintainTask/selectDetailByfMaintainTaskId/${fMaintainTaskId}`),
  //删除保养任务
  deleteById: (fMaintainTaskId) => request.post(`/device-security-service/maintainTask/deleteById/${fMaintainTaskId}`),
  //根据设备id查询保养要点
  selectByEquipmentId:(equipmentId,maintainLevel) => request.get(`/device-security-service/maintainPoints/selectByEquipmentId/${equipmentId}/${maintainLevel}`),
  //根据设备id查询all设备保养项
  selectAllByEquipmentId:(equipmentId,maintainLevel) => request.get(`/device-security-service/maintainItems/selectAllByEquipmentId/${equipmentId}/${maintainLevel}`),
  //更新设备保养记录
  maintainTaskDeleteById: (params) => request.post(`/device-security-service/maintainRecordEquipment/updateRecord`,params),
    //新增设备保养任务
  insertAdd: (params) => request.post(`/device-security-service/maintainPlan/insert`,params),
	// 查询巡检记录图表数据
  getRecordEcharts: (param) => request.post(`/device-security-service/patrolRecord/app/selectChartsByCondition`, param),
  // 查询保养追踪各列表个数
  getNumByMaintainList: () => request.get(`/device-security-service/maintainTask/selectInProgressTaskCount`),
  // 查询设备保养项
  getEquipmentMaintains: (param) => request.get(`/device-security-service/maintainItems/selectByMaintainRecordEquipmentId/${param.maintainRecordEquipmentId}/${param.maintainLevel}`),
  //根据设备id查询保养要点
  getSelectByEquipmentId: (equipmentId,maintainLevel) => request.get(`/device-security-service/maintainPoints/selectByEquipmentId/${equipmentId}/${maintainLevel}`),
  // 更新保养记录
  updateMaintainRecord: (params) => request.post(`/device-security-service/maintainRecordEquipment/updateRecord`, params),
//分页条件查询保养计划列表
  selectListByCondition: (params) => request.post(`/device-security-service/maintainPlan/page/selectListByCondition`,params),
  //查询全部保养计划各保养级别数量
  selectInProgressPlanCount: () => request.get(`/device-security-service/maintainPlan/selectInProgressPlanCount`),
  //根据查询规则查询保养记录
  selectMaintainRecordByAll: (params) => request.post(`/device-security-service/maintainRecordEquipment/selectMaintainRecordByAll`,params),
  //分页条件查询后七天保养计划列表
  selectListByConditionAndRecent: (params) => request.post(`/device-security-service/maintainPlan/page/selectListByConditionAndRecent`,params),
  //查询保养计划详情
  selectDetailByfMaintainPlanId: (fMaintainPlanId) => request.get(`/device-security-service/maintainPlan/selectDetailByfMaintainPlanId/${fMaintainPlanId}`),
  // 单设备查询保养记录
  selectCheckUpListByOneDevice: (params) => request.post(`/device-security-service/patrolEquipment/singleDeviceInspectionRecord`, params),
  // 查询单设备详情
  selectCheckUpDetailByDevice: (params) => request.post(`/device-security-service/patrolEquipment/selectSingleDevice`, params),
  // 单设备查询异常详情
  selectCheckUpAbnormal: (params) => request.post(`/device-security-service/patrolEquipment/singleAbnormal`, params),
  //查询设备保养记录的统计
  selectMaintainStatistics: (params) => request.post(`/device-security-service/maintainRecordEquipment/selectMaintainStatistics`,params),
  //更新保养任务
  updateMaintainTask: (params) => request.post(`/device-security-service/maintainPlan/updateMaintainTask`,params),
  //删除保养任务计划
  maintainPlanDeleteById: (fMaintainPlanId) => request.post(`/device-security-service/maintainPlan/deleteById/${fMaintainPlanId}`),
  //查询全部设备类型信息
  equipmentTypeInfoSelectAll: () => request.get(`/device-service/equipmentTypeInfo/selectAll`),
  //根据设备类型信息ID查询
  typeModelSelect: (params) => request.post(`/device-service/typeModel/select`,params),
  //根据类型型号ID查询
  equipmentKnowledgeFileSelect: (params) => request.post(`/device-service/equipmentKnowledgeFile/select`,params),
  //搜索功能
  typeModelSearch: (params) => request.post(`/device-service/typeModel/search`,params),



};
