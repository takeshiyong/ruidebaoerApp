import request from '../utils/request';

export default  {
  // 用户登录
  doLogin: (regId, params) => request.post(`/user-service/user/appLogin/${regId}`, params),
  // 文件上传
  fileUpload: (file) => request.postFile(`/ikingtech/oss/api/upload/v1`, file),
  // 初始获取部门
  firstLoadDep: () => request.get(`/user-service/departement/selectall`),
  // 通过部门查部门
  selectDepByDep: (param) => request.get(`/user-service/departement/selectdepsbyparentid/${param}`),
  // 查询部门下的人员信息
  selectPeopleByDep: (param) => request.get(`/user-service/employee/selectbydepid/${param}`),
  // 查询用户人员姓名
  getPeopleInfo: () => request.get(`/user-service/employee/selectall`),
  // 查询用户积分相关数据
  getUserIntegral: () => request.get(`/user-service/userMember/selectMemberByUserId`),
  // 查询部门下的所有人员信息（深度）
  selectPeopleAllByDep: (param) => request.get(`/user-service/employee/selectAllEmployeeInfoByDepId/${param}`),
  // 根据id查询用户详情
  selectPeopleDetailById: (param) => request.get(`/user-service/employee/selectEmployeeInfoById/${param}`),
  // 查询版本号
  selectAppVersion: (param) => request.get(`/user-service/appVersion/getAppUpdateInfoByType/${param}`)
};

