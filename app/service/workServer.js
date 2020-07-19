import request from '../utils/request';

export default  {
  // 通过日期查询当天任务列表分页
  getTaskByDate: (params) => request.post(`/message-service/task/selectbypage`, params),  
   //查询指定月份每日是否存在任务
   queryHasTask: (month,userid) => request.get(`/message-service/task/taskCondition/${month}/${userid}`),
};

